import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'


// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import WorkerLayout from './layouts/WorkerLayout'

// Public Pages
import Home from './pages/public/Home'
import News from './pages/public/News'
import About from './pages/public/About'
import Product from './pages/public/Product'
import Archive from './pages/public/Archive'

// Auth Pages
import Login from './pages/auth/Login'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminAquariums from './pages/admin/Aquariums'
import AdminFishSpecies from './pages/admin/FishSpecies'
import AdminFishGrowth from './pages/admin/FishGrowth'
import AdminFishHealth from './pages/admin/FishHealth'
import AdminHarvest from './pages/admin/Harvest'
import AdminFeedingSchedule from './pages/admin/FeedingSchedule'
import AdminFeed from './pages/admin/Feed'
import AdminNews from './pages/admin/News'

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard'
import WorkerAquariums from './pages/worker/Aquariums'
import WorkerFishSpecies from './pages/worker/FishSpecies'
import WorkerFishGrowth from './pages/worker/FishGrowth'
import WorkerFishHealth from './pages/worker/FishHealth'
import WorkerHarvest from './pages/worker/Harvest'
import WorkerFeedingSchedule from './pages/worker/FeedingSchedule'
import WorkerFeed from './pages/worker/Feed'

// Other Pages
import Unauthorized from './pages/Unauthorized'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/product" element={<PublicLayout><Product /></PublicLayout>} />
          <Route path="/archive" element={<PublicLayout><Archive /></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminUsers /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/aquariums"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminAquariums /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fish-species"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminFishSpecies /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fish-growth"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminFishGrowth /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fish-health"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminFishHealth /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/harvest"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminHarvest /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feeding-schedule"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminFeedingSchedule /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feed"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminFeed /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminNews /></AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Worker Routes - Full CRUD access to all fish management */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerDashboard /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/aquariums"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerAquariums /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/fish-species"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerFishSpecies /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/fish-growth"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerFishGrowth /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/fish-health"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerFishHealth /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/harvest"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerHarvest /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/feeding-schedule"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerFeedingSchedule /></WorkerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/feed"
            element={
              <ProtectedRoute>
                <WorkerLayout><WorkerFeed /></WorkerLayout>
              </ProtectedRoute>
            }
          />

          {/* Other Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
