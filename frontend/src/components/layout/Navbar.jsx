import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X, LogOut, LayoutDashboard, User, Search, UserCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../lib/cn'

export default function Navbar({ variant = 'public' }) {
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [loc.pathname])

  const links = [
    { to: '/articulos', label: 'Artículos' },
    { to: '/#features', label: 'Producto' },
    { to: '/#pricing', label: 'Precios' },
    { to: '/#contacto', label: 'Contacto' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-xl bg-white/75 dark:bg-ink-950/80 border-b border-ink-200/60 dark:border-ink-800/80'
          : 'bg-transparent',
      )}
      data-testid="navbar"
    >
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-cabinet font-bold text-lg">
            J
          </span>
          <span className="heading text-xl">JppHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'text-ink-900 dark:text-white'
                    : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white',
                )
              }
              data-testid={`nav-link-${l.label.toLowerCase().replace(/[^a-z]/g,'')}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 transition-colors"
            aria-label="Cambiar tema"
            data-testid="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard" className="btn-ghost" data-testid="nav-dashboard-btn">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/perfil" className="btn-ghost" data-testid="nav-profile-btn" title="Mi perfil">
                <UserCircle size={18}/>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="btn-secondary" data-testid="nav-admin-btn">
                  Admin
                </Link>
              )}
              <button onClick={() => { logout(); nav('/') }} className="btn-outline" data-testid="nav-logout-btn">
                <LogOut size={14} /> Salir
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost" data-testid="nav-login-btn">Ingresar</Link>
              <Link to="/register" className="btn-primary" data-testid="nav-register-btn">
                Empezar gratis
              </Link>
            </div>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800"
            aria-label="Menú"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950">
          <div className="container-wide py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-3 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-ink-200 dark:bg-ink-800 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost justify-start" data-testid="mobile-dashboard-btn">
                  <LayoutDashboard size={16}/> Dashboard
                </Link>
                <Link to="/perfil" className="btn-ghost justify-start" data-testid="mobile-profile-btn">
                  <UserCircle size={16}/> Mi perfil
                </Link>
                {isAdmin && <Link to="/admin" className="btn-secondary justify-start">Admin</Link>}
                <button onClick={() => { logout(); nav('/') }} className="btn-outline justify-start">
                  <LogOut size={14}/> Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost justify-start" data-testid="mobile-login-btn">Ingresar</Link>
                <Link to="/register" className="btn-primary justify-start" data-testid="mobile-register-btn">Empezar gratis</Link>
              </>
            )}
            <button onClick={toggle} className="btn-ghost justify-start mt-2">
              {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>} Tema: {theme === 'dark' ? 'Oscuro' : 'Claro'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
