import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactQuill from 'react-quill'
import toast from 'react-hot-toast'
import { Plus, Pencil, Eye, FileText, CheckCircle2, Clock, XCircle, BarChart3, ArrowUpRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

const CATEGORIES = ['Inteligencia Artificial', 'Automatización', 'SaaS', 'No-code', 'Productividad', 'Marketing']

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
}

export default function Dashboard() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: CATEGORIES[0], content: '' })

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const mine = await api.getMyArticles()
      setArticles(mine)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles() }, [])

  const stats = useMemo(() => ({
    total: articles.length,
    approved: articles.filter((a) => a.status === 'approved').length,
    pending: articles.filter((a) => a.status === 'pending' || a.status === 'in_review').length,
    rejected: articles.filter((a) => a.status === 'rejected').length,
    totalViews: articles.reduce((s, a) => s + (a.views || 0), 0),
  }), [articles])

  const filtered = filter === 'all' ? articles : articles.filter((a) => a.status === filter)

  const openNew = () => {
    setEditing(null)
    setForm({ title: '', description: '', category: CATEGORIES[0], content: '' })
    setModalOpen(true)
  }
  const openEdit = (a) => {
    setEditing(a)
    setForm({ title: a.title, description: a.description || '', category: a.category || CATEGORIES[0], content: a.content || '' })
    setModalOpen(true)
  }

  const save = async (e) => {
    e?.preventDefault()
    if (!form.title.trim()) return toast.error('El título es obligatorio')
    if (!form.content.trim() || form.content === '<p><br></p>') return toast.error('El contenido es obligatorio')
    setSaving(true)
    try {
      if (editing) {
        await api.updateArticle(editing.id, form)
        toast.success('Artículo actualizado. Vuelve a revisión.')
      } else {
        await api.submitArticle(form)
        toast.success('Artículo enviado a revisión.')
      }
      setModalOpen(false)
      fetchArticles()
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-white dark:bg-ink-950">
      <Navbar />
      <div className="container-wide pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-ink-200 dark:border-ink-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Dashboard</span>
            <h1 className="heading text-4xl sm:text-6xl mt-2">
              Hola, <span className="italic font-serif font-normal">{user?.name?.split(' ')[0] || 'autor'}</span>
            </h1>
            <p className="text-ink-600 dark:text-ink-400 mt-2">Tus artículos, tus métricas, tu espacio.</p>
          </div>
          <button onClick={openNew} className="btn-primary btn-lg" data-testid="dashboard-new-article-btn">
            <Plus size={18}/> Nuevo artículo
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { Icon: FileText, label: 'Total', val: stats.total, color: 'text-ink-900 dark:text-white' },
            { Icon: CheckCircle2, label: 'Aprobados', val: stats.approved, color: 'text-emerald-500' },
            { Icon: Clock, label: 'En proceso', val: stats.pending, color: 'text-amber-500' },
            { Icon: BarChart3, label: 'Vistas totales', val: stats.totalViews, color: 'text-ink-900 dark:text-white' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
              data-testid={`stat-card-${s.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-ink-500">{s.label}</span>
                <s.Icon size={16} className={s.color}/>
              </div>
              <p className={'heading text-4xl ' + s.color}>{s.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto" data-testid="dashboard-filters">
          {[
            { k: 'all', label: 'Todos' },
            { k: 'pending', label: 'Pendiente' },
            { k: 'in_review', label: 'En revisión' },
            { k: 'approved', label: 'Aprobados' },
            { k: 'rejected', label: 'Rechazados' },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ' +
                (filter === f.k
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700')
              }
              data-testid={`filter-${f.k}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="card p-10 text-center text-ink-500">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText size={40} className="mx-auto text-ink-300 dark:text-ink-700 mb-4"/>
            <h3 className="heading text-3xl">Aún no hay artículos aquí</h3>
            <p className="text-ink-500 mt-2 mb-6">Empieza escribiendo tu primer artículo sobre IA o automatización.</p>
            <button onClick={openNew} className="btn-primary btn-lg" data-testid="dashboard-empty-new-btn">
              <Plus size={16}/> Escribir el primero
            </button>
          </div>
        ) : (
          <div className="card divide-y divide-ink-200 dark:divide-ink-800 overflow-hidden" data-testid="dashboard-articles-list">
            {filtered.map((a) => (
              <div key={a.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-ink-50 dark:hover:bg-ink-900/50 transition-colors" data-testid={`dashboard-article-${a.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <StatusBadge status={a.status}/>
                    <span className="text-xs font-mono text-ink-500">{a.category}</span>
                  </div>
                  <h3 className="heading text-xl truncate">{a.title}</h3>
                  <p className="text-sm text-ink-500 mt-1 line-clamp-1">{a.description}</p>
                  {a.reviewNote && (
                    <p className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-500/20">
                      <strong>Nota del revisor:</strong> {a.reviewNote}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-ink-500 shrink-0">
                  <span className="flex items-center gap-1"><Eye size={12}/> {a.views || 0}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.status === 'approved' && (
                    <Link to={`/articulos/${a.slug}`} className="btn-ghost" data-testid={`view-article-${a.id}`}>
                      <Eye size={14}/>
                    </Link>
                  )}
                  <button onClick={() => openEdit(a)} className="btn-outline" data-testid={`edit-article-${a.id}`}>
                    <Pencil size={14}/> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal editor */}
      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Editar artículo' : 'Nuevo artículo'}
        size="xl"
      >
        <form onSubmit={save} className="space-y-5" data-testid="article-form">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Título</label>
            <input
              type="text" required className="input"
              placeholder="Un título claro y directo"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              data-testid="article-title-input"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Categoría</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                data-testid="article-category-select"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Descripción corta</label>
              <input
                type="text" className="input"
                placeholder="Resumen de 1-2 líneas"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                data-testid="article-description-input"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Contenido</label>
            <div className="rounded-xl overflow-hidden border border-ink-200 dark:border-ink-700">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                modules={quillModules}
                placeholder="Empieza a escribir…"
                data-testid="article-content-editor"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-200 dark:border-ink-800">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost" disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving} data-testid="article-save-btn">
              {saving ? 'Guardando…' : editing ? 'Actualizar' : 'Enviar a revisión'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
