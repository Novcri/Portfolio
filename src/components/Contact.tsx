import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Twitter, Github, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' }) // フォームクリア
      setTimeout(() => setStatus('idle'), 5000) // 5秒後に元の状態に戻す
    } catch (error) {
      console.error(error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="py-24 px-4 relative bg-slate-50 dark:bg-transparent transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-4 bg-brand-primary/10 text-brand-primary rounded-full mb-6">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-300">Let's Connect</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 transition-colors duration-300">
            新しいプロジェクトやコラボレーション、歓迎します。<br />
            なんでもお気軽にご用件をお伝えください。
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12 bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm text-left relative overflow-hidden">

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="text-emerald-500 mb-4">
                  <CheckCircle2 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">送信完了！</h3>
                <p className="text-slate-600 dark:text-slate-400">メッセージを受け付けました。<br />内容を吟味した後、返信させていただきます。</p>
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">お名前</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">メールアドレス</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">メッセージ内容</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white transition-all resize-none"
                  placeholder="ご相談内容をご記入ください..."
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>送信に失敗しました。時間をおいて再度お試しください。</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    送信する
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center gap-6">
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-light transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1">
              <Twitter className="w-6 h-6" />
              <span className="sr-only">X (Twitter)</span>
            </a>
            <a href="https://github.com/novcri" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-light transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1">
              <Github className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-20%] left-[50%] -translate-x-1/2 w-3/4 h-[500px] bg-brand-primary/10 rounded-full blur-[120px]" />
      </div>
    </section>
  )
}
