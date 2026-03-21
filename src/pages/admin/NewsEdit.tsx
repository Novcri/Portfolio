import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'

export function NewsEdit() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Update',
    summary: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error)
          setFormData({
            title: data.title,
            date: data.date,
            category: data.category,
            summary: data.summary,
            content: data.content
          })
        })
        .catch(err => {
          console.error(err)
          alert('Could not load news details')
          navigate('/admin/news')
        })
    }
  }, [id, isEdit, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const token = localStorage.getItem('adminToken')
    const url = isEdit ? `/api/admin/news/${id}` : '/api/admin/news'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      if (!res.ok) throw new Error('API Error')
      navigate('/admin/news')
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
        <Link to="/admin/news" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit News' : 'Create News'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Date</label>
            <input
              type="date"
              name="date"
              required
              title="Publish Date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Category</label>
            <select
              name="category"
              title="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
            >
              <option value="Update">Update</option>
              <option value="Release">Release</option>
              <option value="Event">Event</option>
              <option value="Media">Media</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Summary (Short)</label>
          <textarea
            name="summary"
            placeholder="A short description for the lists..."
            required
            rows={2}
            value={formData.summary}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Content (Markdown/Text)</label>
          <textarea
            name="content"
            placeholder="Full article content here..."
            required
            rows={10}
            value={formData.content}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
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
