import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import AuthorPublic from './pages/AuthorPublic'
import NotFound from './pages/NotFound'
import { useAuth } from './contexts/AuthContext'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function RequireAuth({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  const loc = useLocation()
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-ink-950">
        <div className="w-10 h-10 border-2 border-ink-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/articulos" element={<Articles />} />
        <Route path="/articulos/:slug" element={<ArticleDetail />} />
        <Route path="/autor/:id" element={<AuthorPublic />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/perfil" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth adminOnly><Admin /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
