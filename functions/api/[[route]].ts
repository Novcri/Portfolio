import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono().basePath('/api')

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
      title: 'Awesome Portfolio',
      description: 'The personal portfolio website you are looking at right now.',
      tech: ['React', 'Hono', 'Vite', 'Cloudflare'],
      url: '#'
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

export const onRequest = handle(app)
export default app
