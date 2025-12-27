import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const quizzesDir = path.join(process.cwd(), "public", "data", "quizzes");
    const files = await readdir(quizzesDir);

    // .jsonファイルのみをフィルタして、拡張子を除いたタイトルを返す
    const quizTitles = files.filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, ""));

    return NextResponse.json({ quizzes: quizTitles });
  } catch (error) {
    console.error("Failed to read quizzes directory:", error);
    return NextResponse.json({ quizzes: [] }, { status: 500 });
  }
}
