import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'

export function ProjectEdit() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '', // カンマ区切りで入力させ、保存時に配列化する
    url: '',
    github_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const token = localStorage.getItem('adminToken')
      fetch(`/api/admin/projects/${id}`, {
        headers: { 'Authorization': `Basic ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error)
          setFormData({
            title: data.title,
            description: data.description,
            tech: Array.isArray(data.tech) ? data.tech.join(', ') : '',
            url: data.url,
            github_url: data.github_url || ''
          })
        })
        .catch(err => {
          console.error(err)
          alert('Could not load project details')
          navigate('/admin/projects')
        })
    }
  }, [id, isEdit, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const token = localStorage.getItem('adminToken')
    const apiUrl = isEdit ? `/api/admin/projects/${id}` : '/api/admin/projects'
    const method = isEdit ? 'PUT' : 'POST'

    // techをカンマ区切りの文字列から配列へ変換
    const techArray = formData.tech.split(',').map(t => t.trim()).filter(t => t.length > 0)

    try {
      const res = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          url: formData.url,
          github_url: formData.github_url,
          tech: techArray
        })
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      if (!res.ok) throw new Error('API Error')
      navigate('/admin/projects')
    } catch (err) {
      console.error(err)
      alert('Save failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/projects" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{isEdit ? 'Edit Project' : 'Create Project'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-300">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">Project Title</label>
          <input
            type="text"
            name="title"
            placeholder="Awesome Project"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">Description</label>
          <textarea
            name="description"
            placeholder="This project is about..."
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary resize-none transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">Technologies (comma separated)</label>
          <input
            type="text"
            name="tech"
            placeholder="React, Tailwind, Hono"
            required
            value={formData.tech}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">Project URL (or #)</label>
          <input
            type="text"
            name="url"
            placeholder="https://..."
            required
            value={formData.url}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">GitHub URL (optional)</label>
          <input
            type="text"
            name="github_url"
            placeholder="https://github.com/..."
            value={formData.github_url}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors duration-300"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
