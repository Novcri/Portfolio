import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'

type Project = {
  id: number
  title: string
  description: string
  tech: string[]
  url: string
}

export function ProjectAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProjects = () => {
    setIsLoading(true)
    const token = localStorage.getItem('adminToken')
    fetch('/api/admin/projects', {
      headers: { 'Authorization': `Basic ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          navigate('/admin/login')
          throw new Error('Unauthorized')
        }
        return res.json()
      })
      .then(data => {
        setProjects(data)
        setIsLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('本当にこのプロジェクトを削除しますか？')) return;

    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${token}` }
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }
      fetchProjects()
    } catch (e) {
      console.error(e)
      alert('Delete failed')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold">Projects Management</h1>
           <p className="text-slate-400 mt-2">ポートフォリオのプロジェクトを一括管理します。</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          Create New
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Tech</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No projects found.</td></tr>
              ) : (
                projects.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-white font-medium max-w-sm truncate text-wrap">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-md truncate text-wrap">
                      {item.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tech.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                            {t}
                          </span>
                        ))}
                        {item.tech.length > 3 && (
                          <span className="text-xs text-slate-500">+{item.tech.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      {item.url !== '#' && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="View Project URL">
                          <ExternalLink className="w-4 h-4 inline" />
                        </a>
                      )}
                      <Link to={`/admin/projects/edit/${item.id}`} className="text-brand-primary hover:text-blue-400 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4 inline" />
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
