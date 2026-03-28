import { motion } from 'framer-motion'
import { Rocket, ArrowDown, Twitter, Github } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-dark/30 rounded-full blur-3xl" />
      </div>

      <div className="z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md mb-8 transition-colors duration-300"
        >
          <Rocket className="w-4 h-4 text-brand-primary dark:text-brand-light" />
          <span className="text-sm text-slate-600 dark:text-slate-300">Available for new opportunities</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-primary">Digital Experiences</span>
          <br />That Matter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors duration-300"
        >
          モダンな Web 技術を駆使し、魅力的でパフォーマンスに優れたアプリケーションを設計・開発するフルスタックエンジニアです。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#projects" className="px-8 py-3 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium transition-all shadow-lg shadow-brand-primary/25">
            View Projects
          </a>
          <a href="#contact" className="px-8 py-3 rounded-full bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium transition-all border border-slate-200 dark:border-slate-700">
            Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <a href="https://x.com/Novcri221114" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-light transition-all border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
            <Twitter className="w-5 h-5" />
            <span className="sr-only">X (Twitter)</span>
          </a>
          <a href="https://github.com/novcri" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-light transition-all border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500 transition-colors duration-300"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  )
}
