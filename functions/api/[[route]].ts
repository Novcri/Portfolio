import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { basicAuth } from 'hono/basic-auth'
import type { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.get('/settings', (c) => {
  return c.json({
    name: 'Your Name',
    role: 'Full Stack Developer',
    description: 'React, TypeScript, Hono, そして Cloudflare を駆使してモダンなWeb体験を創造します。',
    skills: [
      { name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { name: 'Backend', items: ['Node.js', 'Hono.js'] },
      { name: 'Infrastructure', items: ['Cloudflare Pages', 'Cloudflare Workers', 'Cloudflare D1'] },
    ]
  })
})

app.get('/projects', (c) => {
  return c.json([
    {
      id: 1,
      title: 'ポートフォリオ',
      description: 'モダンな技術スタックを用いた、高パフォーマンスかつ美しいポートフォリオサイト',
      tech: ['React', 'Hono', 'Tailwind', 'Vite', 'Cloudflare', 'D1'],
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

// --- Public News API (Using D1) ---
app.get('/news', async (c) => {
  const limitStr = c.req.query('limit');
  let query = 'SELECT * FROM news ORDER BY date DESC';
  
  if (limitStr) {
    const limit = parseInt(limitStr, 10);
    if (!isNaN(limit)) {
      query += ` LIMIT ${limit}`;
    }
  }
  
  const { results } = await c.env.DB.prepare(query).all();
  
  // リストでは content (本文) を省いてデータ転送量を減らす
  return c.json(results.map((r: any) => {
    const { content, ...rest } = r;
    return rest;
  }));
})

app.get('/news/:id', async (c) => {
  const id = c.req.param('id');
  // D1からの取得
  const { results } = await c.env.DB.prepare('SELECT * FROM news WHERE id = ?').bind(id).all();
  
  if (!results || results.length === 0) {
    return c.json({ error: 'News not found' }, 404);
  }
  
  return c.json(results[0]);
})

// --- Admin API (Protected) ---
// Note: 実際の運用ではよりセキュアな認証方法 (Cloudflare Access等) を推奨します
app.use('/admin/*', basicAuth({ username: 'admin', password: 'password' }))

app.post('/admin/news', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  const { title, date, category, summary, content } = body;
  
  await c.env.DB.prepare(
    `INSERT INTO news (id, title, date, category, summary, content) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, title, date, category, summary, content).run();
  
  return c.json({ id, message: 'Created successfully' }, 201);
})

app.put('/admin/news/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, date, category, summary, content } = body;
  
  await c.env.DB.prepare(
    `UPDATE news SET title = ?, date = ?, category = ?, summary = ?, content = ? WHERE id = ?`
  ).bind(title, date, category, summary, content, id).run();
  
  return c.json({ message: 'Updated successfully' });
})

app.delete('/admin/news/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM news WHERE id = ?').bind(id).run();
  return c.json({ message: 'Deleted successfully' });
})

export const onRequest = handle(app)
export default app
