DROP TABLE IF EXISTS news;

CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ローカルテスト用の初期モックデータ
INSERT INTO news (id, title, date, category, summary, content) VALUES
('1', '新しいポートフォリオサイトを公開しました', '2026-03-20', 'Release', '最新の技術スタック（React 19, Hono, Cloudflare Pages）を用いて、ポートフォリオサイトをリニューアルしました。', 'これまで使用していたポートフォリオサイトから大幅に技術スタックを刷新し、React 19とTailwind CSS v4を用いたモダンなフロントエンド、およびHonoによる軽量かつ高速なバックエンドAPIを備えた新しいアーキテクチャへと移行しました。

これによりレスポンス速度の向上だけでなく、今後の拡張性（CMS連携や認証基盤の導入）にも柔軟に対応できる基盤が整いました。

引き続き、新しいプロジェクトや活動状況をこちらで発信していきます。'),
('2', 'E-Commerce Platform のベータ版をリリース', '2026-02-15', 'Update', 'Next.jsとStripeを統合したフルスタックECサイトのベータ版を公開し、一部ユーザー向けにテストを開始しました。', '現在開発中のE-Commerce Platformプロジェクトにおいて、主要な決済フローおよび商品管理機能の実装が完了したため、ベータ版として公開いたしました。

Stripeによる安全な決済処理に加え、商品検索の高速化などのパフォーマンスチューニングを実施しています。今後はユーザーフィードバックをもとにUI/UXの改善を進める予定です。'),
('3', 'テックカンファレンス 2026 春 に登壇します', '2026-01-10', 'Event', '「モダンなサーバーレスアーキテクチャの構築」をテーマに、テックカンファレンスでのセッションに登壇予定です。', '来る2026年4月に開催される「テックカンファレンス 2026 春」において、スピーカーとして登壇することが決定しました。

セッションでは「モダンなサーバーレスアーキテクチャの構築」について、実プロジェクトでのCloudflare Pages Functionsの活用例や、Honoを用いたBFF層のアーキテクチャパターンについて詳しく解説します。オンライン配信もありますので、ぜひご視聴ください。');
