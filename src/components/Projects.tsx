import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'

type Project = {
  id: number
  title: string
  description: string
  tech: string[]
  url: string
  github_url?: string
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vite Dev ServerのHono APIへアクセス
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <section id="projects" className="py-24 px-4 bg-white dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-300">Featured Projects</h2>
          <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-brand-primary dark:border-t-brand-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:border-brand-primary/50 dark:hover:border-brand-primary/50 transition-colors duration-300 backdrop-blur-sm shadow-sm dark:shadow-none"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className={`p-3 rounded-lg ${project.github_url ? 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                      title={!project.github_url ? "No public repository" : undefined}
                    >
                      {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" title="View Source on GitHub">
                          <Github className="w-6 h-6" />
                        </a>
                      ) : (
                        <Github className="w-6 h-6" />
                      )}
                    </div>
                    {project.url !== '#' && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-light transition-colors duration-300">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed line-clamp-3 transition-colors duration-300">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs font-medium px-2.5 py-1 bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-md transition-colors duration-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
