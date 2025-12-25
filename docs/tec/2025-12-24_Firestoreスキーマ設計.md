# Firestoreスキーマ設計

## 概要

タイムアタッククイズ大会アプリのFirestoreデータベース設計書。
リアルタイム同期、統計情報の管理、スコア変遷グラフの要件を満たすスキーマを定義する。

## 設計の経緯

### 検討した項目

1. **scoreHistoryの記録方法**
   - 当初案: 定期的にスナップショットを保存する専用コレクションを用意
   - 決定: answersコレクションの`answeredAt`と`scoreChange`から結果発表時に計算
   - 理由: グラフは結果発表時のみ表示、リアルタイム性不要のためパフォーマンス問題なし

2. **問題データの管理**
   - 決定: JSONファイルのみで管理、Firestoreには保存しない
   - 出題方式: 完全ランダム（同一チーム内での重複も許容）
   - 理由: シンプルな実装、仕様上も重複を気にしない

3. **管理ページのアクセス制御**
   - 決定: URLを知っていればアクセス可能（認証なし）
   - URL形式: `/lobby/{lobbyId}/admin`
   - 理由: 身内での利用のためゆるい制御でOK

4. **スコアと統計情報の管理**
   - 決定: Groupには保存せず、answersから計算
   - 計算場所: クライアント側
   - 理由:
     - リアルタイムで必要なのはスコアのみ
     - 詳細な統計は結果発表時のみ必要
     - トランザクション処理不要でシンプル
     - 規模が小さい（4-5グループ × 最大100回答）ため計算コストは問題なし

---

## コレクション構造

```
lobbies/{lobbyId}
└─ groups/{groupId}
   └─ answers/{answerId}
```

---

## データモデル

### 1. `lobbies` コレクション

ロビー（大会）の情報を管理。

```typescript
interface Lobby {
  id: string;                        // ドキュメントID
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Timestamp;
  startedAt: Timestamp | null;       // 開始時刻
  finishedAt: Timestamp | null;      // 終了時刻
  durationSeconds: number;           // 制限時間（秒） 初期値: 600
  pointsCorrect: number;             // 正解時の得点 初期値: 5
  pointsIncorrect: number;           // 不正解時の減点 初期値: -2
}
```

#### フィールド詳細

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `status` | `'waiting' \| 'playing' \| 'finished'` | 大会の状態 |
| `createdAt` | `Timestamp` | ロビー作成日時 |
| `startedAt` | `Timestamp \| null` | 大会開始日時（開始前はnull） |
| `finishedAt` | `Timestamp \| null` | 大会終了日時（終了前はnull） |
| `durationSeconds` | `number` | 制限時間（デフォルト: 600秒） |
| `pointsCorrect` | `number` | 正解時の得点（デフォルト: 5点） |
| `pointsIncorrect` | `number` | 不正解時の減点（デフォルト: -2点） |

---

### 2. `lobbies/{lobbyId}/groups` サブコレクション

各グループの基本情報。スコアや統計情報は`answers`サブコレクションから計算する。

```typescript
interface Group {
  id: string;                        // ドキュメントID
  lobbyId: string;                   // 親ロビーのID
  name: string;                      // グループ名
  createdAt: Timestamp;
}
```

#### フィールド詳細

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `lobbyId` | `string` | 親ロビーのID |
| `name` | `string` | グループ名（参加時に入力） |
| `createdAt` | `Timestamp` | グループ作成日時 |

#### 計算される情報（answersから導出）

以下の情報は`answers`サブコレクションから計算されます：

- **スコア**: `scoreChange`の合計
- **総回答数**: answersドキュメント数
- **正解数/不正解数**: `isCorrect`でフィルタ
- **正解率**: 正解数 / 総回答数
- **最大連続正解数**: answersを時系列で走査
- **平均回答時間**: `answerTimeMs`の平均
- **最速回答時間**: `isCorrect=true`の中で最小の`answerTimeMs`
- **残り2分のスコア**: `answeredAt`が終了2分前以降の`scoreChange`合計

---

### 3. `lobbies/{lobbyId}/groups/{groupId}/answers` サブコレクション

各グループの回答履歴。スコア変遷グラフの元データとしても使用。

```typescript
interface Answer {
  id: string;                        // ドキュメントID
  groupId: string;                   // グループID
  questionIndex: number;             // 問題のインデックス（JSONファイル内）
  selectedAnswer: number;            // 選択した回答（0-2）
  correctAnswer: number;             // 正解（0-2）
  isCorrect: boolean;                // 正解/不正解
  answeredAt: Timestamp;             // 回答時刻
  answerTimeMs: number;              // 問題表示から回答までの時間（ミリ秒）
  scoreChange: number;               // このクイズによる得点変化（+5 or -2）
}
```

#### フィールド詳細

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `questionIndex` | `number` | JSONファイル内の問題番号 |
| `selectedAnswer` | `number` | 選択した選択肢（0-2） |
| `correctAnswer` | `number` | 正解の選択肢（0-2） |
| `isCorrect` | `boolean` | 正解ならtrue、不正解ならfalse |
| `answeredAt` | `Timestamp` | 回答した日時（グラフのX軸データ） |
| `answerTimeMs` | `number` | 問題表示から回答までの経過時間 |
| `scoreChange` | `number` | この回答による得点変化 |

---

## 実装計画

### フェーズ1: 基本的なCRUD操作

1. **Lobbyの作成**
   - TOPページでロビーを新規作成
   - 初期値: `status='waiting'`, `durationSeconds=600`, `pointsCorrect=5`, `pointsIncorrect=-2`

2. **Groupの参加**
   - ロビーページでグループ名を入力
   - `groups`サブコレクションに新規ドキュメント作成

3. **Answerの記録**
   - グループページで回答
   - `answers`サブコレクションに新規ドキュメント作成（追記のみ）

### フェーズ2: リアルタイム同期とクライアント側計算

1. **管理ページでのランキング表示**
   - 各グループの`answers`サブコレクションにリアルタイムリスナーを設定
   - クライアント側で各グループのスコアを計算（`scoreChange`の合計）
   - 計算したスコアでソートして上位5チームを表示

2. **グループページでのスコア・残り時間表示**
   - 自グループの`answers`サブコレクションをリアルタイム監視
   - クライアント側でスコアを計算
   - `Lobby`の`startedAt`と`durationSeconds`から残り時間を計算

### フェーズ3: 統計情報の計算（結果発表時）

1. **answersからの統計計算ロジック**
   - 全グループの`answers`を取得
   - クライアント側で以下を計算:
     - 総回答数: answersドキュメント数
     - 正解数/不正解数: `isCorrect`でフィルタ
     - 正解率: 正解数 / 総回答数
     - 最大連続正解数: answersを時系列で走査
     - 平均回答時間: `answerTimeMs`の平均
     - 最速回答時間: 正解の中で最小の`answerTimeMs`
     - 残り2分のスコア: 終了2分前以降の`scoreChange`合計

2. **アワードの判定**
   - 各グループの統計情報を比較
   - 最速正解賞: 最速回答時間が最小のグループ
   - ラストスパート賞: 残り2分のスコアが最大のグループ

### フェーズ4: スコア変遷グラフ

1. **データ取得**
   - 全グループの`answers`サブコレクションを`answeredAt`でソート
   - グループごとに時系列で累積スコアを計算

2. **グラフ描画**
   - 折れ線グラフで各グループのスコア推移を表示
   - X軸: 経過時間（秒）
   - Y軸: スコア

---

## 実装時の注意点

### セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // lobbiesは誰でも読み書き可能（身内用途）
    match /lobbies/{lobbyId} {
      allow read, write: if true;

      match /groups/{groupId} {
        allow read, write: if true;

        match /answers/{answerId} {
          allow read, write: if true;
        }
      }
    }
  }
}
```

**注意**: 身内用途のため認証なし。本番環境では適切なルールを設定すること。

### 回答の記録

回答時はanswerドキュメントの追加のみ。トランザクション不要でシンプル:

```typescript
// 回答時の処理例
const answerRef = doc(collection(db, `lobbies/${lobbyId}/groups/${groupId}/answers`));

await setDoc(answerRef, {
  groupId,
  questionIndex,
  selectedAnswer,
  correctAnswer,
  isCorrect,
  answeredAt: serverTimestamp(),
  answerTimeMs,
  scoreChange: isCorrect ? pointsCorrect : pointsIncorrect
});
```

### インデックス

必要に応じて以下のインデックスを作成:

- `answers`サブコレクション: `answeredAt`（昇順） - グラフ・統計計算用

### パフォーマンス考慮事項

- グループ数は4-5程度のため、スケーラビリティの懸念は少ない
- 10分間で最大500回答程度（5グループ × 100問）のため、書き込み負荷も問題なし
- リアルタイムリスナーは管理ページで最大5個（各グループのanswers）
- クライアント側の計算負荷は軽微（最大500ドキュメントの集計程度）
- answersは追記のみのため、データ整合性が保証される

---

## 今後の拡張性

現在の設計で対応していない、将来的に追加可能な機能:

- カテゴリ別の問題管理
- 管理者認証機能
- リプレイ機能（過去の大会の再生）
- チーム内メンバー管理

これらの機能が必要になった場合は、スキーマの拡張が必要。
