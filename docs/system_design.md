# Portfolio サイト システム設計書

## 1. プロジェクト概要
本作は、高品質な UI/UX を持ち、Cloudflare Pages 上でフルスタックに機能するポートフォリオサイトです。

## 2. システムアーキテクチャ
- **フロントエンド:**
  - React 19 (TypeScript) + Vite
  - React Router (react-router-dom) （複数ページのルーティング）
  - Tailwind CSS v4（スタイリング全般）
  - Framer Motion（高度な UI アニメーション）
- **バックエンド (API / BFF):**
  - Hono.js
  - Cloudflare Pages Functions (`functions/api/[[route]].ts`) 
- **データベース:**
  - Cloudflare D1 (サーバーレス SQLite DB)
    - 本サイトでの管理対象： `news` (ニュース記事), `projects` (ポートフォリオ作品: `url` と `github_url` を保持), `users` (管理者認証用ポータル)
- **デプロイ基盤:**
  - Cloudflare Pages (静的ホスティング + サーバーレスAPI)
  - `wrangler.toml` および `npm run build` によってコマンドラインから直接デプロイ可能。

## 3. ディレクトリ・ファイル構成
```text
Portfolio/
├── src/                      # フロントエンドのソースコード群
│   ├── components/           # UIコンポーネント
│   ├── pages/                # ページコンポーネント (Home, NewsList, NewsDetail)
│   │   └── admin/            # 管理画面用ページ (AdminLayout, NewsAdmin, NewsEdit, Login)
│   ├── types/                # TypeScript型定義 (News etc.)
│   ├── App.tsx               # アプリケーションのルーティングレイアウト
│   ├── index.css             # グローバルスタイル (Tailwindインポートを含む)
│   └── main.tsx              # Reactの初期化 (BrowserRouter設定)
├── functions/api/            # バックエンド (Cloudflare Functions向け Hono API)
│   └── [[route]].ts          # APIの基底ルーティングファイル
├── docs/                     # 本ディレクトリ。設計書や運用ルールを格納する
├── wrangler.toml             # Cloudflare Pages のデプロイ設定
└── gemini.md                 # AI向けの大方針・コンテキスト
```

## 4. UI/UX デザイン設計
- **テーマ:** ライト/ダークテーマ両対応（`useTheme` フックにて OS 設定および `localStorage` 経由で切替。Tailwind CSS v4 の `@custom-variant dark` を利用）
- **ビジュアルパターン:**
  - グラスモーフィズム (背景のぼかし、半透明のパネル `backdrop-blur`)
  - グラデーションテクニックによるアクセント (`bg-brand-primary` 等のオリジナルカラー)
- **アニメーション:**
  - `framer-motion` を利用したスクロール連動のフェードイン (`whileInView`)
  - スクロール進捗バー (`useScroll`)
  - ページ読み込み時の要素ごとの段階的表示 (`delay` を使った Stagger 効果)
- **ナビゲーションと導線:**
  - グローバルナビゲーション、フッター、Heroセクション、Contactセクション等の要所に、外部サイト（X、GitHubなど）のソーシャルリンクを共通のアイコン (`lucide-react`) を用いて配置

## 5. API エンドポイント設計
ベースパス: `/api`
- `GET /api/projects`
  - 概要: ポートフォリオとして表示するプロジェクト一覧のJSON配列を返す。
- `GET /api/news`
  - 概要: ニュース一覧のJSON配列を返す。クエリパラメータ `?limit=N` で取得件数を制限可能。
- `GET /api/news/:id`
  - 概要: 特定のIDを持つニュースの詳細をJSONで返す。見つからない場合は404を返す。
- `GET /api/settings`
  - 概要: サイトの全体設定やプロフィール情報を返す（現在はモックデータを返却。将来のCMS等への連携に備えた設計）。

### 管理者用 API (要 Basic Auth)
ベースパス: `/api/admin`
- `GET /api/admin/verify`
  - 概要: フロントエンドからのログイン試行時に、トークンの有効性を D1 データベース（SHA-256 ロック機構）と照合してチェックするエンドポイント。
  - 備考: 標準の Basic 認証を使うとブラウザ側のネイティブログインダイアログが表示されてしまうため、`WWW-Authenticate: Basic` ヘッダーを意図的に外したカスタム認証ミドルウェアを通している。
- `POST /api/admin/news`, `PUT /api/admin/news/:id`, `DELETE /api/admin/news/:id`
  - 概要: D1の `news` レコードに対する作成・更新・削除エンドポイント。
- `GET /api/admin/projects`, `GET /api/admin/projects/:id`
  - 概要: プロジェクトの全件取得および詳細取得（管理者向け・フルフィールド）。
- `POST /api/admin/projects`, `PUT /api/admin/projects/:id`, `DELETE /api/admin/projects/:id`
  - 概要: D1の `projects` レコードに対する作成・更新・削除エンドポイント。

## 6. 保守・拡張方針（AI・開発者向け重要ルール）
今後、機能の回収や追加を実施する際は、以下のルールを遵守してください。
1. **設計の事前確認:** 実装に入る前に必ず本ディレクトリ (`docs/`) 内の設計書を読み込み、アーキテクチャの大枠を把握すること。
2. **設計書の継続的更新:** 新規の機能（APIや画面要素等）の追加、大元となるロジックの改修などを行った際は、実装後（あるいは実装と並行して）必ずこの `docs/system_design.md` などの設計ドキュメントに変更内容を書き加え、仕様と実装の乖離を防ぐこと。
3. **拡張時の推奨事項:** 動的なデータ管理が求められた場合、フロントエンドで直接外部と通信するのではなく、Hono の API 層を通じて Cloudflare D1 や CMS への Fetch 処理を挟み込む（BFF層としての活用）構造を意識すること。
