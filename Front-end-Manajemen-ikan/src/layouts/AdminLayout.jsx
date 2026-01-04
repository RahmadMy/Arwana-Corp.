import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import companyIcon from '../assets/images/company-icon.png'
import {
  FaWater,
  FaFish,
  FaEllipsisH,
  FaChartLine,
  FaUsers,
  FaNewspaper,
  FaHome,
  FaSignOutAlt
} from 'react-icons/fa'

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // State for collapsible menus (default open for visibility)
  const [openFish, setOpenFish] = useState(true)
  const [openSystem, setOpenSystem] = useState(true)

  /* ================= ACTIVE HELPERS ================= */
  const isExactActive = (path) => location.pathname === path
  const isPrefixActive = (path) => location.pathname.startsWith(path)

  /* ================= PATH GROUP ================= */
  // Updated: Fish Management is now just one page technically (Growth), 
  // but we keep the logic clean if we want to highlighting.
  // The user asked to remove Health, Harvest, Feeding from Nav.

  const fishOperationPaths = [
    '/admin/aquariums',
    '/admin/fish-species',
    '/admin/feed',
    '/admin/fish-growth', // Renamed to "Fish Management" in UI
  ]

  const systemPaths = [
    '/admin/users',
    '/admin/news',
  ]

  const isFishOperationActive = fishOperationPaths.some(isPrefixActive)
  const isSystemActive = systemPaths.some(isPrefixActive)

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-orange-500 selection:text-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900/80 border-r border-zinc-800 backdrop-blur-xl flex flex-col z-50">

        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-600 opacity-80" />

        {/* Logo */}
        <div className="px-6 py-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-sm opacity-20 rounded-full"></div>
            <img src={companyIcon} alt="logo" className="w-8 h-9 relative z-10" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            Arowana <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Corp.</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 text-gray-400 space-y-2 overflow-y-auto custom-scrollbar">

          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isExactActive('/admin/dashboard')
                ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-white border-l-2 border-orange-500'
                : 'hover:bg-zinc-800 hover:text-white'
              }`}
          >
            <FaHome className={`w-4 h-4 transition-colors ${isExactActive('/admin/dashboard') ? 'text-orange-500' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* ================= FISH OPERATIONS (Group) ================= */}
          <div>
            <button
              onClick={() => setOpenFish(!openFish)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isFishOperationActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FaWater className={`w-4 h-4 ${isFishOperationActive ? 'text-orange-500' : 'text-gray-500'}`} />
                <span className="font-semibold text-xs uppercase tracking-wider">Operations</span>
              </div>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${openFish ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openFish && (
              <div className="mt-1 ml-4 pl-4 border-l border-zinc-700 space-y-1">

                <Link
                  to="/admin/aquariums"
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isExactActive('/admin/aquariums')
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <span>Aquarium</span>
                </Link>

                <Link
                  to="/admin/fish-species"
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isExactActive('/admin/fish-species')
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <span>Fish Species</span>
                </Link>

                <Link
                  to="/admin/feed"
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isExactActive('/admin/feed')
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <span>Feed</span>
                </Link>

                {/* FISH MANAGEMENT (Formerly Fish Growth) - MOVED HERE AS REQUESTED */}
                <Link
                  to="/admin/fish-growth"
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isExactActive('/admin/fish-growth')
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <span>Fish Management</span>
                </Link>

              </div>
            )}
          </div>

          {/* ================= SYSTEM MANAGEMENT (Group) ================= */}
          <div>
            <button
              onClick={() => setOpenSystem(!openSystem)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isSystemActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FaEllipsisH className={`w-4 h-4 ${isSystemActive ? 'text-orange-500' : 'text-gray-500'}`} />
                <span className="font-semibold text-xs uppercase tracking-wider">System</span>
              </div>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${openSystem ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSystem && (
              <div className="mt-1 ml-4 pl-4 border-l border-zinc-700 space-y-1">
                <Link to="/admin/users"
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isExactActive('/admin/users')
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <span>Users</span>
                </Link>

                <Link to="/admin/news"
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isExactActive('/admin/news')
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <span>News</span>
                </Link>
              </div>
            )}
          </div>

        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center text-white font-bold shadow-lg">
              {(user?.name || 'A')[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-orange-500">Administrator</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-all text-sm font-medium group"
          >
            <FaSignOutAlt className="w-4 h-4 group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 ml-64 flex flex-col bg-black relative">
        {/* Top Header */}
        <header className="px-8 py-5 flex justify-between items-center backdrop-blur-sm sticky top-0 z-40 border-b border-zinc-800/50 bg-black/80">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Welcome back,
              </span>{' '}
              <span className="text-orange-500">{user?.name?.split(' ')[0] || 'Admin'}</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your facility today.</p>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}

export default AdminLayout
