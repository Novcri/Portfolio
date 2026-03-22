import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { News } from '../types/news'

export function NewsSection() {
  const [newsList, setNewsList] = useState<News[]>([])

  useEffect(() => {
    fetch('/api/news?limit=3')
      .then(res => res.json())
      .then(data => setNewsList(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <section id="news" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-transparent transition-colors duration-300">
      {/* 背景エフェクト */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-brand-primary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Latest <span className="text-brand-primary">News</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
            活動状況や最新のアップデートをお知らせします。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {newsList.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-brand-primary/30 dark:hover:border-brand-primary/30 transition-all duration-300 group group-hover:-translate-y-1 flex flex-col items-start shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-3 mb-4 w-full">
                <span className="text-xs font-medium px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full">
                  {news.category}
                </span>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 ml-auto transition-colors duration-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(news.date).toLocaleDateString('ja-JP')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-light transition-colors duration-300 line-clamp-2">
                <Link to={`/news/${news.id}`} className="focus:outline-none before:absolute before:inset-0">
                  {news.title}
                </Link>
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 relative z-10 transition-colors duration-300">
                {news.summary}
              </p>
              <div className="mt-auto relative z-10 flex items-center text-sm text-brand-primary font-medium group-hover:translate-x-1 transition-transform cursor-pointer">
                <Link autoFocus={false} to={`/news/${news.id}`} className="flex items-center hover:underline">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="mt-12 text-center"
        >
          <Link
            to="/news"
            className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-medium transition-colors border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm dark:shadow-none"
          >
            すべてのニュースを見る
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
