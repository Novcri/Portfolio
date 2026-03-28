import { motion } from 'framer-motion'
import { Mail, MessageSquare, Twitter, Github } from 'lucide-react'

export const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 relative bg-white dark:bg-transparent transition-colors duration-300">
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
            新しいプロジェクトやコラボレーションの機会を探しています。
            あなたのビジョンを形にするお手伝いをさせてください。お気軽にご連絡ください！
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Mail className="w-5 h-5" />
            Say Hello
          </a>

          <div className="flex justify-center items-center gap-6 mt-12">
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
