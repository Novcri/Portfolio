import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import type { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  DB: D1Database
  WEBHOOK_URL?: string
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

app.get('/projects', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return c.json(results.map((r: any) => ({
    ...r,
    tech: JSON.parse(r.tech as string)
  })));
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

// --- Public Contact API ---
app.post('/contact', async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // 文字数・長さのバリデーション (DoS対策)
    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return c.json({ error: 'Input too long' }, 400);
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    await c.env.DB.prepare(
      `INSERT INTO contacts (id, name, email, message) VALUES (?, ?, ?, ?)`
    ).bind(id, name, email, message).run();

    // Discord等へのWebhook通知
    if (c.env.WEBHOOK_URL) {
      const safeMessage = message.replace(/`/g, '´'); // バッククォートを置換してMarkdownインジェクションを防止
      const payload = {
        content: `📬 **新しいお問い合わせが届きました！**\n**Name:** ${name}\n**Email:** ${email}\n**Message:**\n\`\`\`\n${safeMessage}\n\`\`\``
      };
      
      // Cloudflare Workerの仕様：awaitしない非同期処理はレスポンス返却時に強制終了されるため、waitUntil()で延命する
      const webhookPromise = fetch(c.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('Webhook error:', err));
      
      c.executionCtx.waitUntil(webhookPromise);
    }

    return c.json({ success: true, message: 'Message sent successfully' }, 201);
  } catch (error) {
    console.error('Contact error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
})

// --- Admin API (Protected) ---
app.use('/admin/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  const { results } = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).all();
  if (!results || results.length === 0) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const user = results[0] as any;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  if (user.password_hash !== hashHex) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
})

app.get('/admin/verify', (c) => {
  return c.json({ ok: true })
})

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

app.get('/admin/projects', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return c.json(results.map((r: any) => ({
    ...r,
    tech: JSON.parse(r.tech as string)
  })));
})

app.post('/admin/projects', async (c) => {
  const body = await c.req.json();
  const { title, description, tech, url, github_url } = body;
  const techStr = JSON.stringify(tech);

  const { meta } = await c.env.DB.prepare(
    `INSERT INTO projects (title, description, tech, url, github_url) VALUES (?, ?, ?, ?, ?)`
  ).bind(title, description, techStr, url, github_url || '').run();

  return c.json({ id: meta.last_row_id, message: 'Created successfully' }, 201);
})

app.put('/admin/projects/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, description, tech, url, github_url } = body;
  const techStr = JSON.stringify(tech);

  await c.env.DB.prepare(
    `UPDATE projects SET title = ?, description = ?, tech = ?, url = ?, github_url = ? WHERE id = ?`
  ).bind(title, description, techStr, url, github_url || '', id).run();

  return c.json({ message: 'Updated successfully' });
})

app.delete('/admin/projects/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return c.json({ message: 'Deleted successfully' });
})

app.get('/admin/projects/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).all();

  if (!results || results.length === 0) {
    return c.json({ error: 'Project not found' }, 404);
  }

  const project = results[0] as any;
  return c.json({
    ...project,
    tech: JSON.parse(project.tech as string)
  });
})

app.get('/admin/contacts', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  return c.json(results);
})

app.delete('/admin/contacts/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();
  return c.json({ message: 'Deleted successfully' });
})

export const onRequest = handle(app)
export default app
