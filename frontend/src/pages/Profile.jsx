import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Save, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import ImageUpload from '../components/ui/ImageUpload'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, updateMe } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  })
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateMe(form)
      toast.success('Perfil actualizado')
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-white dark:bg-ink-950">
      <Navbar />
      <div className="container-tight pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10 pb-8 border-b border-ink-200 dark:border-ink-800 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Perfil</span>
            <h1 className="heading text-4xl sm:text-6xl mt-2">Tu perfil público.</h1>
            <p className="text-ink-600 dark:text-ink-400 mt-2">Lo que verán los lectores cuando hagan click en tu nombre.</p>
          </div>
          {user?.id && (
            <Link to={`/autor/${user.id}`} className="btn-outline" data-testid="profile-preview-btn">
              <Eye size={14}/> Ver mi perfil público
            </Link>
          )}
        </motion.div>

        <form onSubmit={save} className="card p-8 sm:p-10 space-y-8" data-testid="profile-form">
          <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
            <div className="w-32 shrink-0">
              <ImageUpload
                value={form.avatarUrl}
                onChange={(url) => setForm({ ...form, avatarUrl: url })}
                label="Avatar"
                aspect="square"
                testid="profile-avatar"
              />
            </div>
            <div className="flex-1 space-y-5">
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Nombre</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="profile-name-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Email</label>
                <input type="email" disabled className="input bg-ink-50 dark:bg-ink-900 cursor-not-allowed" value={user?.email || ''}/>
                <p className="text-xs text-ink-500 mt-1">El email no se puede modificar por seguridad.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Bio</label>
            <textarea
              rows={5}
              maxLength={500}
              className="input pt-3 h-auto resize-none"
              placeholder="Cuéntales a tus lectores quién eres, qué haces, en qué eres experto…"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              data-testid="profile-bio-input"
            />
            <p className="text-xs text-ink-500 mt-1 text-right">{form.bio.length}/500</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-ink-200 dark:border-ink-800">
            <button type="submit" className="btn-primary btn-lg" disabled={saving} data-testid="profile-save-btn">
              {saving ? 'Guardando…' : <>Guardar cambios <Save size={16}/></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
