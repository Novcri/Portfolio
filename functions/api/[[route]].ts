import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono().basePath('/api')

// --- Mock Data ---
const mockNews = [
  {
    id: '1',
    title: '新しいポートフォリオサイトを公開しました',
    date: '2026-03-20',
    category: 'Release',
    summary: '最新の技術スタック（React 19, Hono, Cloudflare Pages）を用いて、ポートフォリオサイトをリニューアルしました。',
    content: 'これまで使用していたポートフォリオサイトから大幅に技術スタックを刷新し、React 19とTailwind CSS v4を用いたモダンなフロントエンド、およびHonoによる軽量かつ高速なバックエンドAPIを備えた新しいアーキテクチャへと移行しました。\n\nこれによりレスポンス速度の向上だけでなく、今後の拡張性（CMS連携や認証基盤の導入）にも柔軟に対応できる基盤が整いました。\n\n引き続き、新しいプロジェクトや活動状況をこちらで発信していきます。'
  },
  {
    id: '2',
    title: 'E-Commerce Platform のベータ版をリリース',
    date: '2026-02-15',
    category: 'Update',
    summary: 'Next.jsとStripeを統合したフルスタックECサイトのベータ版を公開し、一部ユーザー向けにテストを開始しました。',
    content: '現在開発中のE-Commerce Platformプロジェクトにおいて、主要な決済フローおよび商品管理機能の実装が完了したため、ベータ版として公開いたしました。\n\nStripeによる安全な決済処理に加え、商品検索の高速化などのパフォーマンスチューニングを実施しています。今後はユーザーフィードバックをもとにUI/UXの改善を進める予定です。'
  },
  {
    id: '3',
    title: 'テックカンファレンス 2026 春 に登壇します',
    date: '2026-01-10',
    category: 'Event',
    summary: '「モダンなサーバーレスアーキテクチャの構築」をテーマに、テックカンファレンスでのセッションに登壇予定です。',
    content: '来る2026年4月に開催される「テックカンファレンス 2026 春」において、スピーカーとして登壇することが決定しました。\n\nセッションでは「モダンなサーバーレスアーキテクチャの構築」について、実プロジェクトでのCloudflare Pages Functionsの活用例や、Honoを用いたBFF層のアーキテクチャパターンについて詳しく解説します。オンライン配信もありますので、ぜひご視聴ください。'
  },
  {
    id: '4',
    title: '技術ブログの連載開始のお知らせ',
    date: '2025-12-05',
    category: 'Media',
    summary: 'フロントエンドのパフォーマンステクニックに関する連載記事の執筆を開始しました。',
    content: 'より多くの方にモダンなフロントエンドの知見を共有するため、外部の技術メディアにて連載を開始しました。Reactのレンダリング最適化やFramer Motionを用いたアニメーション実装のベストプラクティスなど、実践的な内容をお届けします。'
  }
];

// --- Routes ---
app.get('/settings', (c) => {
  return c.json({
    name: 'Your Name',
    role: 'Full Stack Developer',
    description: 'React, TypeScript, Hono, そして Cloudflare を駆使してモダンなWeb体験を創造します。',
    skills: [
      { name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { name: 'Backend', items: ['Node.js', 'Hono.js'] },
      { name: 'Infrastructure', items: ['Cloudflare Pages', 'Cloudflare Workers'] },
    ]
  })
})

app.get('/projects', (c) => {
  return c.json([
    {
      id: 1,
      title: 'ポートフォリオ',
      description: 'モダンな技術スタックを用いた、高パフォーマンスかつ美しいポートフォリオサイト',
      tech: ['React', 'Hono', 'Tailwind', 'Vite', 'Cloudflare'],
      url: 'https://github.com/Novcri/Portfolio'
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'モダンなフルスタック構成で構築されたECサイトプラットフォーム。',
      tech: ['Next.js', 'Stripe', 'Tailwind'],
      url: '#'
    }
  ])
})

app.get('/news', (c) => {
  const limitStr = c.req.query('limit');
  let result = [...mockNews];
  
  // Sort by date descending
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (limitStr) {
    const limit = parseInt(limitStr, 10);
    if (!isNaN(limit)) {
      result = result.slice(0, limit);
    }
  }
  
  // Return summarize versions without full content for list
  return c.json(result.map(({ content, ...rest }) => rest));
})

app.get('/news/:id', (c) => {
  const id = c.req.param('id');
  const newsItem = mockNews.find((n) => n.id === id);
  
  if (!newsItem) {
    return c.json({ error: 'News not found' }, 404);
  }
  
  return c.json(newsItem);
})

export const onRequest = handle(app)
export default app
