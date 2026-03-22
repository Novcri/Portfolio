import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom'
import { LogOut, LayoutDashboard, Newspaper, AppWindow } from 'lucide-react'

export function AdminLayout() {
  const token = localStorage.getItem('adminToken')
  const navigate = useNavigate()

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row">
      {/* サイドバー */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <LayoutDashboard className="text-brand-primary w-6 h-6" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-2">
          <NavLink 
            to="/admin/news" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Newspaper className="w-5 h-5" />
            News Management
          </NavLink>
          <NavLink 
            to="/admin/projects" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <AppWindow className="w-5 h-5" />
            Projects Management
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors py-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
