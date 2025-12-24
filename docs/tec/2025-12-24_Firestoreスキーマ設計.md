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

各グループの情報と統計データ。リアルタイムランキング表示に使用。

```typescript
interface Group {
  id: string;                        // ドキュメントID
  lobbyId: string;                   // 親ロビーのID
  name: string;                      // グループ名
  score: number;                     // 現在のスコア
  createdAt: Timestamp;

  stats: {
    totalAnswers: number;            // 総回答数
    correctCount: number;            // 正解数
    incorrectCount: number;          // 不正解数
    correctRate: number;             // 正解率 (correctCount / totalAnswers)
    maxStreak: number;               // 最大連続正解数
    currentStreak: number;           // 現在の連続正解数
    totalAnswerTimeMs: number;       // 総回答時間（ミリ秒）
    averageAnswerTimeMs: number;     // 平均回答時間（ミリ秒）
    fastestAnswerMs: number | null;  // 最速回答時間（最速正解賞用）
    lastTwoMinutesScore: number;     // 残り2分のスコア（ラストスパート賞用）
  };
}
```

#### フィールド詳細

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `name` | `string` | グループ名（参加時に入力） |
| `score` | `number` | 現在のスコア（回答ごとに更新） |
| `stats.totalAnswers` | `number` | 総回答数 |
| `stats.correctRate` | `number` | 正解率（0.0〜1.0） |
| `stats.maxStreak` | `number` | 最大連続正解数 |
| `stats.currentStreak` | `number` | 現在の連続正解数（不正解でリセット） |
| `stats.averageAnswerTimeMs` | `number` | 1問あたりの平均回答時間 |
| `stats.fastestAnswerMs` | `number \| null` | 最速正解時の回答時間（最速正解賞） |
| `stats.lastTwoMinutesScore` | `number` | 残り2分間で獲得したスコア（ラストスパート賞） |

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
   - 初期値: `score=0`, `stats`は全てゼロ

3. **Answerの記録**
   - グループページで回答
   - `answers`サブコレクションに新規ドキュメント作成
   - 同時に`Group`の`score`と`stats`を更新

### フェーズ2: リアルタイム同期

1. **管理ページでのランキング表示**
   - `groups`コレクションにリアルタイムリスナーを設定
   - `score`フィールドでソートして上位5チームを表示

2. **グループページでのスコア・残り時間表示**
   - 自グループの`Group`ドキュメントをリアルタイム監視
   - `Lobby`の`startedAt`と`durationSeconds`から残り時間を計算

### フェーズ3: 統計情報の計算

1. **回答時の統計更新ロジック**
   - `stats.totalAnswers` をインクリメント
   - 正解/不正解に応じて `correctCount` / `incorrectCount` を更新
   - `correctRate` を再計算
   - 連続正解数 `currentStreak` を更新、`maxStreak` と比較
   - `totalAnswerTimeMs` に加算し、`averageAnswerTimeMs` を再計算
   - 正解時、`fastestAnswerMs` と比較して更新
   - 残り2分以内なら `lastTwoMinutesScore` に加算

2. **アワードの判定**
   - 結果発表時に全グループの`stats`を比較
   - 最速正解賞: `fastestAnswerMs`が最小
   - ラストスパート賞: `lastTwoMinutesScore`が最大

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

### トランザクション処理

回答時の更新は複数フィールドにまたがるため、トランザクションまたはバッチ処理を使用:

```typescript
// 回答時の処理例
const answerRef = doc(collection(db, `lobbies/${lobbyId}/groups/${groupId}/answers`));
const groupRef = doc(db, `lobbies/${lobbyId}/groups/${groupId}`);

await runTransaction(db, async (transaction) => {
  const groupSnap = await transaction.get(groupRef);
  const currentGroup = groupSnap.data();

  // Answer作成
  transaction.set(answerRef, answerData);

  // Group更新（スコア、統計）
  transaction.update(groupRef, {
    score: currentGroup.score + scoreChange,
    'stats.totalAnswers': increment(1),
    // ...その他の統計フィールド
  });
});
```

### インデックス

必要に応じて以下のインデックスを作成:

1. `groups`コレクション: `score`（降順） - ランキング表示用
2. `answers`サブコレクション: `answeredAt`（昇順） - グラフ用

### パフォーマンス考慮事項

- グループ数は4-5程度のため、スケーラビリティの懸念は少ない
- 10分間で最大500回答程度（5グループ × 100問）のため、書き込み負荷も問題なし
- リアルタイムリスナーは各クライアントで最大2-3個程度

---

## 今後の拡張性

現在の設計で対応していない、将来的に追加可能な機能:

- カテゴリ別の問題管理
- 管理者認証機能
- リプレイ機能（過去の大会の再生）
- チーム内メンバー管理

これらの機能が必要になった場合は、スキーマの拡張が必要。
