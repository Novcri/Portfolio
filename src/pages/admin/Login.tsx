import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    const token = btoa(`${username}:${password}`)
    
    try {
      // 実際にAPIを叩いて認証チェックを行う
      const res = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Basic ${token}` }
      })

      if (res.ok) {
        localStorage.setItem('adminToken', token)
        navigate('/admin/news')
      } else {
        setError('Invalid username or password.')
      }
    } catch (err) {
      console.error(err)
      setError('Login failed due to a network error.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Admin Login</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  )
}
