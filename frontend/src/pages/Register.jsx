import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const { theme, toggle } = useTheme()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('¡Cuenta creada! Bienvenido a JppHub.')
      nav('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-ink-950">
      <div className="flex flex-col px-6 sm:px-10 lg:px-20 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="register-logo">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-cabinet font-bold">J</span>
            <span className="heading text-xl">JppHub</span>
          </Link>
          <button onClick={toggle} className="w-9 h-9 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 inline-flex items-center justify-center" data-testid="register-theme-toggle">
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
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">Empezar gratis</span>
            <h1 className="heading text-4xl sm:text-5xl mt-3">Publica para<br/>lectores reales.</h1>
            <p className="text-ink-600 dark:text-ink-400 mt-4">
              Crea tu cuenta en 30 segundos. Sin tarjeta. Sin trucos.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5" data-testid="register-form">
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Nombre</label>
                <input
                  type="text" required className="input" placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="register-name-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Email</label>
                <input
                  type="email" required className="input" placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="register-email-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required minLength={6}
                    className="input pr-11"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    data-testid="register-password-input"
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-ink-400 hover:text-ink-900 dark:hover:text-white" tabIndex={-1}>
                    {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full" data-testid="register-submit-btn">
                {loading ? 'Creando cuenta…' : (<>Crear cuenta gratis <ArrowRight size={16} /></>)}
              </button>

              <p className="text-xs text-ink-500 text-center">
                Al crear una cuenta aceptas nuestros términos y política de privacidad.
              </p>

              <p className="text-sm text-center text-ink-500">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-ink-900 dark:text-white font-medium underline underline-offset-4" data-testid="register-login-link">
                  Ingresar
                </Link>
              </p>
            </form>
          </motion.div>
        </div>

        <p className="text-xs text-ink-500 text-center">© {new Date().getFullYear()} JppHub</p>
      </div>

      <div className="hidden lg:flex relative bg-ink-50 dark:bg-ink-900 overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 grid-pattern opacity-60 text-ink-900 dark:text-white"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">¿Qué incluye gratis?</span>
          <h2 className="heading text-4xl mt-3">Todo lo esencial para<br/>publicar bien.</h2>
        </motion.div>
        <ul className="relative space-y-5">
          {[
            'Editor WYSIWYG con soporte enriquecido',
            'Revisión editorial en menos de 48h',
            'Dashboard con estadísticas claras',
            'Publicación instantánea al aprobar',
            'SEO y enlaces compartibles automáticos',
          ].map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="flex items-start gap-3 text-ink-800 dark:text-ink-200"
            >
              <span className="mt-1 w-5 h-5 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 inline-flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={3}/>
              </span>
              <span className="font-cabinet text-lg">{t}</span>
            </motion.li>
          ))}
        </ul>

        <div className="relative grid grid-cols-3 gap-6 pt-8 border-t border-ink-200 dark:border-ink-800">
          <div>
            <p className="heading text-3xl">250+</p>
            <p className="text-xs text-ink-500 font-mono uppercase tracking-widest">Autores</p>
          </div>
          <div>
            <p className="heading text-3xl">1.2k</p>
            <p className="text-xs text-ink-500 font-mono uppercase tracking-widest">Publicados</p>
          </div>
          <div>
            <p className="heading text-3xl">&lt;24h</p>
            <p className="text-xs text-ink-500 font-mono uppercase tracking-widest">Revisión</p>
          </div>
        </div>
      </div>
    </div>
  )
}
