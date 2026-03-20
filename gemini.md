# AI 連携用プロジェクトコンテキスト (GEMINI.md)

このファイルは、AIアシスタント（Gemini 等）が本プロジェクトの構成および設計ルールを理解するためのドキュメントです。

## プロジェクト概要
このプロジェクトは、高品質な UI/UX を持ち、Cloudflare Pages 上でフルスタックに機能するポートフォリオサイトです。

## 設計ルール
- **言語およびフレームワーク:**
  - クライアント側は React、TypeScriptを使用。状態管理は React Hooks の範囲内でシンプルに保つ。
  - スタイリングには Tailwind CSS (v4) を利用し、カスタムCSSは `index.css` に最小限かつ集約して記述する。
  - アニメーション実装には `framer-motion` を標準とする。
  - バックエンドとして `functions/api/` に Hono.js の API エンドポイントを配置する。Cloudflare の Pages Functions としてデプロイされることを想定し、`hono/cloudflare-pages` の `handle` でエクスポートする。
  
- **Vite 構成:**
  - `vite.config.ts` で `@hono/vite-dev-server` を利用し、開発時に `/api` のリクエストを `functions/api/[[route]].ts` の Hono サーバーにバイパスする構成とする。

## 構造
- `/src`: React フロントエンドコンポーネント群。
- `/functions/api`: Hono ベースラインAPI。Cloudflare Pages の Functions 規則に従う。
- `wrangler.toml`: デプロイ用構成。

## 今後の拡張方針
- バックエンドの API (`/api/projects` など) に対して CMS (Contentful や Sanity など) または Cloudflare D1 との連携を追加することで自己更新可能なポートフォリオとして拡張可能。

## 設計情報の管理（AI向け運用ルール）
- 本プロジェクトの詳細なシステム設計書は `docs/` フォルダ配下（例: `docs/system_design.md`）に格納されています。
- **重要:** 今後システムの回収や機能の追加・変更を実施する際は、必ず事前に `docs/` ディレクトリ内の該当する設計ドキュメントを読み込んでコンテキストを理解し、変更が生じた場合は文書の更新（書き加え）を同時に行ってください。
