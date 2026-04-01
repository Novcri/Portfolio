import { motion } from 'framer-motion'
import { Code2, Layout, Database, Bot } from 'lucide-react'

export const About = () => {
  const skills = [
    { icon: <Layout className="w-6 h-6" />, title: 'Frontend', desc: 'React, Tailwind CSSを用いた魅力的なUI構築' },
    { icon: <Database className="w-6 h-6" />, title: 'Backend', desc: 'Node.js, Hono.js, SpringBootを活用した高速でスケーラブルな API 開発' },
    { icon: <Code2 className="w-6 h-6" />, title: 'Architecture', desc: 'TypeScript と Cloudflare を活用した堅牢でモダンなインフラ設計' },
    { icon: <Bot className="w-6 h-6" />, title: 'AI', desc: 'AIを活用したアプリケーション開発' },
  ]

  return (
    <section id="about" className="py-24 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-300">About Me</h2>
            <div className="w-20 h-1 bg-brand-primary rounded-full mb-8" />
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed transition-colors duration-300">
              私はモダンな Web アプリケーションの構築を専門とするエンジニアです。
              ユーザーエクスプレリエンスを最重視し、直感的で使いやすいインターフェースと、
              堅牢なバックエンドシステムを両立させることを目標にしています。
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
              現在は React と TypeScript エコシステムを中心に、Cloudflare などの
              エッジコンピューティング技術を活用した高速な体験の提供に注力しています。<br />
              また、SpringBootを活用したバックエンド開発も行っています。<br />
              最近では、AntigravityなどのAIを活用したアプリケーション開発にも取り組んでいます。
            </p>
          </motion.div>

          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 transition-colors shadow-sm dark:shadow-none"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-light flex items-center justify-center mb-4 transition-colors duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-300">{skill.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
