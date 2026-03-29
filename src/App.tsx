import { motion, useScroll, useSpring } from 'framer-motion'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Twitter, Github } from 'lucide-react'
import { Home } from './pages/Home'
import { NewsList } from './pages/NewsList'
import { NewsDetail } from './pages/NewsDetail'
import { AdminLayout } from './pages/admin/AdminLayout'
import { Login } from './pages/admin/Login'
import { NewsAdmin } from './pages/admin/NewsAdmin'
import { NewsEdit } from './pages/admin/NewsEdit'
import { ProjectAdmin } from './pages/admin/ProjectAdmin'
import { ProjectEdit } from './pages/admin/ProjectEdit'
import { ContactAdmin } from './pages/admin/ContactAdmin'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const { scrollYProgress } = useScroll()
  const { pathname, hash } = useLocation()

  const isAdmin = pathname.startsWith('/admin')

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Hash link scroll handler
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans selection:bg-brand-primary/30 selection:text-brand-primary dark:selection:text-white transition-colors duration-300">
      {!isAdmin && (
        <>
          {/* 進行度プログレスバー */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-brand-primary origin-left z-50 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
            style={{ scaleX }}
          />

          {/* ナビゲーション */}
          <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white hover:text-brand-primary dark:hover:text-brand-light transition-colors">
                Novcri's Portfolio<span className="text-brand-primary">.</span>
              </Link>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Link to="/#about" className="hover:text-brand-primary dark:hover:text-white transition-colors">About</Link>
                <Link to="/#projects" className="hover:text-brand-primary dark:hover:text-white transition-colors">Projects</Link>
                <Link to="/#contact" className="hover:text-brand-primary dark:hover:text-white transition-colors">Contact</Link>
                <Link to="/news" className="hover:text-brand-primary dark:hover:text-white transition-colors">News</Link>
                <div className="flex items-center gap-4 ml-4">
                  <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary dark:hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://github.com/novcri" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary dark:hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
                <div className="ml-4 border-l border-slate-200 dark:border-slate-700 pl-4 py-1">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/news" replace />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="news/new" element={<NewsEdit />} />
            <Route path="news/edit/:id" element={<NewsEdit />} />
            <Route path="projects" element={<ProjectAdmin />} />
            <Route path="projects/new" element={<ProjectEdit />} />
            <Route path="projects/edit/:id" element={<ProjectEdit />} />
            <Route path="contacts" element={<ContactAdmin />} />
          </Route>
        </Routes>
      </main>

      {!isAdmin && (
        <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500 text-sm transition-colors duration-300">
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">X (Twitter)</span>
            </a>
            <a href="https://github.com/novcri" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
          <p>© {new Date().getFullYear()} Portfolio. Built with React, Tailwind & Hono.</p>
        </footer>
      )}
    </div>
  )
}

export default App
