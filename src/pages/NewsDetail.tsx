import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { News } from '../types/news'

export function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [news, setNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetch(`/api/news/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setNews(data)
        setIsLoading(false)
      })
      .catch((e) => {
        console.error(e)
        // Redirect to list if not found
        navigate('/news', { replace: true })
      })
  }, [id, navigate])

  if (isLoading || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-24 min-h-screen relative bg-slate-50 dark:bg-transparent transition-colors duration-300">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-primary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <article className="max-w-3xl mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Link to="/news" className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ニュース一覧に戻る
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium px-4 py-1.5 bg-brand-primary/20 text-brand-primary rounded-full">
                {news.category}
              </span>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(news.date).toLocaleDateString('ja-JP')}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-slate-900 dark:text-white transition-colors duration-300">
              {news.title}
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 font-light leading-relaxed border-l-4 border-brand-primary/50 pl-4 py-1 transition-colors duration-300">
              {news.summary}
            </p>
          </header>

          <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-10 transition-colors duration-300" />

          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300 transition-colors duration-300">
            {news.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-16 text-center">
               <Link
                 to="/news"
                 className="inline-flex items-center px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-full font-medium transition-all hover:-translate-y-1 shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700"
               >
                 <ArrowLeft className="w-5 h-5 mr-3" />
               他のニュースも見る
             </Link>
          </div>
        </motion.div>
      </article>
    </div>
  )
}
