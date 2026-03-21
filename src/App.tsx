import { motion, useScroll, useSpring } from 'framer-motion'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Home } from './pages/Home'
import { NewsList } from './pages/NewsList'
import { NewsDetail } from './pages/NewsDetail'
import { AdminLayout } from './pages/admin/AdminLayout'
import { Login } from './pages/admin/Login'
import { NewsAdmin } from './pages/admin/NewsAdmin'
import { NewsEdit } from './pages/admin/NewsEdit'

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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-primary/30 selection:text-white">
      {!isAdmin && (
        <>
          {/* 進行度プログレスバー */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-brand-primary origin-left z-50 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
            style={{ scaleX }}
          />
          
          {/* ナビゲーション */}
          <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="text-xl font-bold tracking-tighter hover:text-brand-light transition-colors">
                Portfolio<span className="text-brand-primary">.</span>
              </Link>
              <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
                <Link to="/#about" className="hover:text-white transition-colors">About</Link>
                <Link to="/#projects" className="hover:text-white transition-colors">Projects</Link>
                <Link to="/#contact" className="hover:text-white transition-colors">Contact</Link>
                <Link to="/news" className="hover:text-white transition-colors">News</Link>
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
            <Route path="news" element={<NewsAdmin />} />
            <Route path="news/new" element={<NewsEdit />} />
            <Route path="news/edit/:id" element={<NewsEdit />} />
          </Route>
        </Routes>
      </main>

      {!isAdmin && (
        <footer className="py-8 text-center border-t border-slate-800 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Portfolio. Built with React, Tailwind & Hono.</p>
        </footer>
      )}
    </div>
  )
}

export default App
