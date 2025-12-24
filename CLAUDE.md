# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 参照ドキュメント
- @docs/specs/2025-12-24_タイムアタッククイズ大会アプリ仕様.md
- @docs/specs/2025-12-24_デザイン基本方針.md

## 🚨 核心制約

### NEVER（絶対禁止）
- NEVER: data-testidをテストで使用

### YOU MUST（必須事項）
- YOU MUST: 質問をする場合は、1つずつ質問してください。チャットなので。。。
- YOU MUST: ユーザーの指示で不明瞭な箇所は必ず聞き返してください。これすごく重要！！ぜひ一緒に仕様をつくっていきましょう！

### IMPORTANT（重要事項）
- IMPORTANT: Chakra UI v3 Modern API準拠
- IMPORTANT: 3ステップ以上でTodoWrite使用
- IMPORTANT: 作業開始前に計画することを好む
- IMPORTANT: バレルエクスポート禁止
- IMPORTANT: utf-8を利用すること
- IMPORTANT: TypeScriptの型は推論を利用すること
- IMPORTANT: 定数化は2箇所以上で利用しているときのみとする
- IMPORTANT: 開発者の指摘が誤っているときは、根拠を示して反論すること

## 技術スタック
- Next.js 16
- React 19
- Chakra UI v3
- TypeScript
- pnpm
- Biome
