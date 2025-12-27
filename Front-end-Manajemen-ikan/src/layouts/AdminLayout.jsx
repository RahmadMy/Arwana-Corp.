import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import companyIcon from '../assets/images/company-icon.png'
import {FaWater,FaFish,FaEllipsisH,FaChartLine,FaHeartbeat,FaClock,FaCalendarCheck,FaUsers,FaNewspaper} from 'react-icons/fa'

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [openFish, setOpenFish] = useState(true)
  const [openFishManagement, setOpenFishManagement] = useState(true)
  const [openSystem, setOpenSystem] = useState(true)

  /* ================= ACTIVE HELPERS ================= */
  const isExactActive = (path) => location.pathname === path
  const isPrefixActive = (path) => location.pathname.startsWith(path)

  /* ================= PATH GROUP ================= */
  const fishManagementPaths = [
    '/admin/fish-growth',
    '/admin/fish-health',
    '/admin/feeding-schedule',
    '/admin/harvest',
  ]

  const fishOperationPaths = [
    '/admin/aquariums',
    '/admin/fish-species',
    '/admin/feed',
    ...fishManagementPaths,
  ]

  const systemPaths = [
    '/admin/users',
    '/admin/news',
  ]

  const isFishOperationActive = fishOperationPaths.some(isPrefixActive)
  const isFishManagementActive = fishManagementPaths.some(isPrefixActive)
  const isSystemActive = systemPaths.some(isPrefixActive)

  return (
    <div className="min-h-screen bg-black flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-800 flex items-center gap-2">
          <img src={companyIcon} alt="logo" className="w-8 h-9" />
          <span className="text-white font-bold text-2xl">
            Arowana <span className="text-orange-500">Corp.</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 text-white space-y-1">

          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className={`block px-4 py-3 ${
              isExactActive('/admin/dashboard')
                ? 'border-l-4 border-orange-500 text-orange-500'
                : 'hover:text-orange-500'
            }`}
          >
            Dashboard
          </Link>

          {/* ================= FISH OPERATIONS ================= */}
          <button
            onClick={() => setOpenFish(!openFish)}
            className={`w-full flex items-center justify-between px-4 py-3 ${
              isFishOperationActive ? 'text-orange-500' : 'hover:text-orange-500'
            }`}
          >
            <span>Fish Operations</span>
            <svg
              className={`w-4 h-4 transition-transform ${openFish ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openFish && (
            <div className="ml-4 border-l border-gray-700 space-y-1 text-sm">

              <Link
                to="/admin/aquariums"
                className={`flex items-center gap-3 px-4 py-2 ${
                  isExactActive('/admin/aquariums')
                    ? 'text-orange-500'
                    : 'hover:text-orange-500'
                }`}
              >
                <FaWater className="w-4 h-4" />
                <span>Aquarium</span>
              </Link>

              <Link
                to="/admin/fish-species"
                className={`flex items-center gap-3 px-4 py-2 ${
                  isExactActive('/admin/fish-species')
                    ? 'text-orange-500'
                    : 'text-white hover:text-orange-500'
                }`}
              >
                <FaFish className="w-4 h-4" />
                <span>Fish Species</span>
              </Link>

              <Link
                to="/admin/feed"
                className={`flex items-center gap-3 px-4 py-2 ${
                  isExactActive('/admin/feed')
                    ? 'text-orange-500'
                    : 'hover:text-orange-500'
                }`}
              >
                <FaEllipsisH className="w-4 h-4" />
                <span>Feed</span>
              </Link>

              {/* ================= FISH MANAGEMENT ================= */}
              <button
                onClick={() => setOpenFishManagement(!openFishManagement)}
                className={`w-full flex items-center justify-between px-4 py-2 ${
                  isFishManagementActive ? 'text-orange-500' : 'hover:text-orange-500'
                }`}
              >
                <span>Fish Management</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openFishManagement ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openFishManagement && (
                <div className="ml-4 border-l border-gray-600 space-y-1">

                  <Link to="/admin/fish-growth"
                    className={`flex items-center gap-3 px-4 py-2 ${
                      isExactActive('/admin/fish-growth')
                        ? 'text-orange-500'
                        : 'hover:text-orange-500'
                    }`}
                  >
                    <FaChartLine className="w-4 h-4" />
                    <span>Fish Growth</span>
                  </Link>

                  <Link to="/admin/fish-health"
                    className={`flex items-center gap-3 px-4 py-2 ${
                      isExactActive('/admin/fish-health')
                        ? 'text-orange-500'
                        : 'hover:text-orange-500'
                    }`}
                  >
                    <FaHeartbeat className="w-4 h-4" />
                    <span>Fish Health</span>
                  </Link>

                  <Link to="/admin/feeding-schedule"
                    className={`flex items-center gap-3 px-4 py-2 ${
                      isExactActive('/admin/feeding-schedule')
                        ? 'text-orange-500'
                        : 'hover:text-orange-500'
                    }`}
                  >
                    <FaClock className="w-4 h-4" />
                    <span>Feeding Schedule</span>
                  </Link>

                  <Link to="/admin/harvest"
                    className={`flex items-center gap-3 px-4 py-2 ${
                      isExactActive('/admin/harvest')
                        ? 'text-orange-500'
                        : 'hover:text-orange-500'
                    }`}
                  >
                    <FaCalendarCheck className="w-4 h-4" />
                    <span>Harvest Schedule</span>
                  </Link>

                </div>
              )}

            </div>
          )}

          {/* ================= SYSTEM MANAGEMENT ================= */}
          <button
            onClick={() => setOpenSystem(!openSystem)}
            className={`w-full flex items-center justify-between px-4 py-3 ${
              isSystemActive ? 'text-orange-500' : 'hover:text-orange-500'
            }`}
          >
            <span>System Management</span>
            <svg
              className={`w-4 h-4 transition-transform ${openSystem ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openSystem && (
            <div className="ml-4 border-l border-gray-700 space-y-1 text-sm">
              <Link to="/admin/users"
                className={`flex items-center gap-3 px-4 py-2 ${
                  isExactActive('/admin/users')
                    ? 'text-orange-500'
                    : 'hover:text-orange-500'
                }`}
              >
                <FaUsers className="w-4 h-4" />
                <span>Users</span>
              </Link>

              <Link to="/admin/news"
                className={`flex items-center gap-3 px-4 py-2 ${
                  isExactActive('/admin/news')
                    ? 'text-orange-500'
                    : 'hover:text-orange-500'
                }`}
              >
                <FaNewspaper className="w-4 h-4" />
                <span>News</span>
              </Link>
            </div>
          )}

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:text-orange-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="bg-black border-b border-gray-800 px-6 py-4 flex justify-between">
        <span className="text-white font-semibold">Admin Dashboard</span>

        <div className="flex items-center gap-3 text-white">
          <div className="flex flex-col items-end">
            <span className="text-sm">{user?.name || 'User'}</span>
            <span className="text-xs text-orange-500">Admin</span>
          </div>

          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">
              {(user?.name || 'A')[0]}
            </span>
          </div>
        </div>
      </header>

        <main className="flex-1 bg-black text-white p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
