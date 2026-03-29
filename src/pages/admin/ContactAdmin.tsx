import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { Contact } from '../../types/contact'

export function ContactAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchContacts = () => {
    setIsLoading(true)
    const token = localStorage.getItem('adminToken')
    fetch('/api/admin/contacts', {
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
        setContacts(data)
        setIsLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('このお問い合わせを削除しますか？\n（復元できません）')) return;

    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${token}` }
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }
      fetchContacts()
    } catch (e) {
      console.error(e)
      alert('Delete failed')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Contacts Management</h1>
           <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors duration-300">サイトのお問い合わせフォームから送信されたメッセージを一覧管理します。</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[150px]">Date</th>
                <th className="px-6 py-4 font-medium">Sender</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 text-sm transition-colors duration-300">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">Loading...</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No contacts found.</td></tr>
              ) : (
                contacts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group align-top">
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      <div className="text-slate-900 dark:text-white font-medium truncate" title={item.name}>{item.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 truncate">
                        <a href={`mailto:${item.email}`} className="hover:text-brand-primary dark:hover:text-brand-light transition-colors" title={item.email}>
                          {item.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 max-w-sm">
                      <div className="whitespace-pre-wrap text-sm line-clamp-3" title={item.message}>
                        {item.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
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
