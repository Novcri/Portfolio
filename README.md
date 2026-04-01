# Portfolio Project

モダンな技術スタックを用いた、高パフォーマンスかつ美しいポートフォリオサイトです。
フロントエンドは React と Tailwind CSS、Framer Motion で構成され、バックエンドは Hono.js で Cloudflare Pages 上にデプロイされる設計になっています。

## 技​​術スタック
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (v4), Framer Motion, Lucide React
- **Backend:** Hono.js
- **Infrastructure:** Cloudflare Pages (Pages Functions)

## 特徴
- **適切な UI/UX 設計:** ダークテーマ・グラスモーフィズムを中心とし、Framer Motion を用いた滑らかなスクロールとフェードインアニメーションを実装。
- **フルスタックルーティング:** 開発時は Vite 経由で Hono devServer がAPIリクエストを処理し、本番環境では Cloudflare Pages Functions が担当します。
- **高速な配信:** 静的ファイルとAPIがシームレスに Edge から配信されます。

## ローカル開発環境の起動
依存パッケージのインストール後、標準のNode.js環境では以下のコマンドで起動します。

```bash
npm install
npm run dev
```

### Dockerを利用したローカル開発（推奨）
Dockerがインストールされている環境であれば、以下のコマンドのみで依存関係やD1ローカルデータベースを含めた専用開発環境が構築・起動します。

```bash
docker compose up -d --build
```

いずれの場合も、起動後は `http://localhost:5173` でフロントエンドへのアクセスが可能です。バックエンド (Hono API) には `/api/...` にリクエストがバイパスされます。

## デプロイメント
このプロジェクトは Cloudflare Pages に直接デプロイ可能です。
Cloudflareのダッシュボードからリポジトリを連携し、以下の設定を行ってください。
- **ビルドコマンド:** `npm run build`
- **出力ディレクトリ:** `dist`

Wrangler を使用して CLI から直接ビルド・デプロイすることも可能です：
```bash
npm run build
npx wrangler pages deploy dist
```
