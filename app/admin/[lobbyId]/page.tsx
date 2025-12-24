"use client";

import { AdminAfterQuiz } from "@/app/admin/[lobbyId]/_components/AdminAfterQuiz";
// モックアップ確認用: 表示したい状態のコンポーネントをインポート
// 各状態を確認するには、インポートとreturn文を切り替えてください

// import { AdminBeforeStart } from "./_components/AdminBeforeStart"
// import { AdminAfterQuiz } from "./_components/AdminAfterQuiz"

export default function AdminPage() {
  // モックアップなので固定で1つの状態を表示
  // 他の状態を確認する場合は、上記のインポートとreturnを切り替え

  // return <AdminBeforeStart />; // 開始前
  // return <AdminDuringQuiz />; // クイズ中 ← 現在表示中
  return <AdminAfterQuiz />; // 終了後
}
