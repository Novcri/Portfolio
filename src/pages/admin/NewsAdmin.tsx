import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'
import type { News } from '../../types/news'

export function NewsAdmin() {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchNews = () => {
    setIsLoading(true)
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data)
        setIsLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('本当にこのニュースを削除しますか？')) return;

    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${token}` }
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }
      fetchNews() // リロード
    } catch (e) {
      console.error(e)
      alert('Delete failed')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold">News Management</h1>
           <p className="text-slate-400 mt-2">D1 データベース上のニュース記事を一括管理します。</p>
        </div>
        <Link
          to="/admin/news/new"
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
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">Loading...</td></tr>
              ) : news.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No news found.</td></tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-medium border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium max-w-md truncate">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <Link to={`/news/${item.id}`} target="_blank" className="text-slate-400 hover:text-white transition-colors" title="View Public Page">
                        <ExternalLink className="w-4 h-4 inline" />
                      </Link>
                      <Link to={`/admin/news/edit/${item.id}`} className="text-brand-primary hover:text-blue-400 transition-colors" title="Edit">
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
