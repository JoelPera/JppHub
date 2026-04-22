import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const { theme, toggle } = useTheme()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('¡Bienvenido de nuevo!')
      const from = loc.state?.from || '/dashboard'
      nav(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-ink-950">
      {/* Form side */}
      <div className="flex flex-col px-6 sm:px-10 lg:px-20 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" data-testid="login-logo">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-cabinet font-bold">J</span>
            <span className="heading text-xl">JppHub</span>
          </Link>
          <button onClick={toggle} className="w-9 h-9 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 inline-flex items-center justify-center" data-testid="login-theme-toggle">
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
        </div>

        <div className="flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">Acceso</span>
            <h1 className="heading text-4xl sm:text-5xl mt-3">Bienvenido<br/>de nuevo.</h1>
            <p className="text-ink-600 dark:text-ink-400 mt-4">
              Ingresa a tu dashboard y continúa publicando.
            </p>

            <form onSubmit={onSubmit} className="mt-10 space-y-5" data-testid="login-form">
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Email</label>
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="login-email-input"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Contraseña</label>
                  <a href="#" className="text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">¿Olvidaste?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    className="input pr-11"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    data-testid="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-ink-400 hover:text-ink-900 dark:hover:text-white"
                    tabIndex={-1}
                    data-testid="login-toggle-password"
                  >
                    {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full" data-testid="login-submit-btn">
                {loading ? 'Ingresando…' : (<>Ingresar <ArrowRight size={16} /></>)}
              </button>

              <p className="text-sm text-center text-ink-500 pt-2">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/register" className="text-ink-900 dark:text-white font-medium underline underline-offset-4" data-testid="login-register-link">
                  Crear cuenta
                </Link>
              </p>
            </form>

            <div className="mt-10 p-4 rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-sm text-ink-600 dark:text-ink-400">
              <p className="font-medium text-ink-900 dark:text-white mb-1">Demo</p>
              <p>Admin: <code className="font-mono text-xs">admin@jpphub.com</code> / <code className="font-mono text-xs">Admin123!</code></p>
              <p>Autor: <code className="font-mono text-xs">autor@jpphub.com</code> / <code className="font-mono text-xs">Autor123!</code></p>
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-ink-500 text-center">© {new Date().getFullYear()} JppHub</p>
      </div>

      {/* Visual side */}
      <div className="hidden lg:block relative bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 text-white"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <blockquote className="font-serif italic text-4xl leading-snug max-w-xl">
              "JppHub filtra el ruido. Lo que publicas aquí, llega a lectores que <span className="not-italic font-cabinet">importan</span>."
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-cabinet font-bold text-xl">M</div>
              <div>
                <p className="font-medium">Marta Sánchez</p>
                <p className="text-sm text-white/60">AI Engineer · Barcelona</p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-10 right-10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Editorial live
        </div>
      </div>
    </div>
  )
}
