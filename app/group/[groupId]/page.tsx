"use client"

// モックアップ確認用: 表示したい状態のコンポーネントをインポート
// 各状態を確認するには、インポートとreturn文を切り替えてください

// import { GroupWaiting } from "./_components/GroupWaiting"
import { GroupQuiz } from "./_components/GroupQuiz"
// import { GroupResult } from "./_components/GroupResult"
// import { GroupFinished } from "./_components/GroupFinished"

export default function GroupPage() {
  // モックアップなので固定で1つの状態を表示
  // 他の状態を確認する場合は、上記のインポートとreturnを切り替え

  // return <GroupWaiting />    // 待機中
  return <GroupQuiz />          // クイズ回答中 ← 現在表示中
  // return <GroupResult />     // 回答結果（正解/不正解）
  // return <GroupFinished />   // 終了
}
