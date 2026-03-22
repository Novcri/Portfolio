import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { News } from '../types/news'

export function NewsList() {
  const [newsList, setNewsList] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNewsList(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="pt-24 pb-16 min-h-screen relative overflow-hidden bg-slate-50 dark:bg-transparent transition-colors duration-300">
      {/* 背景エフェクト */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-12"
        >
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            All <span className="text-brand-primary">News</span>
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg transition-colors duration-300">
            活動の履歴やアップデートの一覧です。
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {newsList.map((news, index) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 group flex flex-col md:flex-row gap-6 md:items-center relative shadow-sm dark:shadow-none"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-medium px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full">
                      {news.category}
                    </span>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(news.date).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-light transition-colors duration-300">
                    <Link to={`/news/${news.id}`} className="focus:outline-none before:absolute before:inset-0">
                      {news.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base line-clamp-2 md:line-clamp-none transition-colors duration-300">
                    {news.summary}
                  </p>
                </div>
                <div className="md:w-32 flex md:justify-end text-brand-primary relative z-10 transition-transform group-hover:translate-x-2">
                   <ArrowRight className="w-6 h-6" />
                </div>
              </motion.article>
            ))}
            
            {newsList.length === 0 && (
               <p className="text-slate-600 dark:text-slate-400 text-center py-10 transition-colors duration-300">ニュースがありません。</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
