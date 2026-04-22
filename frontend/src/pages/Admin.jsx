import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Users, FileText, CheckCircle2, Clock, XCircle, Eye,
  Check, X, RefreshCcw, Trash2, UserCog, BarChart3, Search,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import { api } from '../lib/api'

const PAGE_SIZE = 10

export default function Admin() {
  const [tab, setTab] = useState('queue')
  const [stats, setStats] = useState({})
  const [articles, setArticles] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pageA, setPageA] = useState(1)
  const [pageU, setPageU] = useState(1)

  const [reviewArticle, setReviewArticle] = useState(null)
  const [reviewAction, setReviewAction] = useState('approve')
  const [reviewNote, setReviewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [s, a, u] = await Promise.all([
        api.getAdminStats(),
        api.getAllArticles(),
        api.getAllUsers(),
      ])
      setStats(s || {})
      setArticles(a || [])
      setUsers(u || [])
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const queue = useMemo(
    () => articles.filter((a) => a.status === 'pending' || a.status === 'in_review'),
    [articles]
  )

  const filteredArticles = useMemo(() => {
    let r = articles
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((a) =>
        (a.title + ' ' + (a.authorName || '') + ' ' + (a.category || '')).toLowerCase().includes(q)
      )
    }
    return r
  }, [articles, search])

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter((u) => (u.name + ' ' + u.email + ' ' + u.role).toLowerCase().includes(q))
  }, [users, search])

  const pagedArticles = filteredArticles.slice((pageA - 1) * PAGE_SIZE, pageA * PAGE_SIZE)
  const pagedUsers = filteredUsers.slice((pageU - 1) * PAGE_SIZE, pageU * PAGE_SIZE)
  const totalPagesA = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const totalPagesU = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))

  const openReview = (a, action = 'approve') => {
    setReviewArticle(a)
    setReviewAction(action)
    setReviewNote(a.reviewNote || '')
  }

  const submitReview = async (e) => {
    e?.preventDefault()
    if (!reviewArticle) return
    if ((reviewAction === 'reject' || reviewAction === 'request_changes') && !reviewNote.trim()) {
      return toast.error('Añade una nota explicando tu decisión')
    }
    setSubmitting(true)
    try {
      await api.reviewArticle(reviewArticle.id, reviewAction, reviewNote)
      toast.success('Artículo actualizado')
      setReviewArticle(null)
      fetchAll()
    } catch (err) {
      toast.error(err.message || 'Error al revisar')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteArticle = async (a) => {
    if (!confirm(`¿Eliminar "${a.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.deleteArticle(a.id)
      toast.success('Artículo eliminado')
      fetchAll()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const changeRole = async (u, role) => {
    try {
      await api.updateUserRole(u.id, role)
      toast.success(`Rol actualizado para ${u.name}`)
      fetchAll()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const statCards = [
    { Icon: FileText, label: 'Total artículos', val: articles.length, color: 'text-ink-900 dark:text-white' },
    { Icon: Clock, label: 'En cola', val: queue.length, color: 'text-amber-500' },
    { Icon: CheckCircle2, label: 'Aprobados', val: stats.articles?.approved ?? articles.filter((a) => a.status === 'approved').length, color: 'text-emerald-500' },
    { Icon: Users, label: 'Usuarios', val: users.length, color: 'text-ink-900 dark:text-white' },
  ]

  return (
    <div className="min-h-full bg-white dark:bg-ink-950">
      <Navbar />
      <div className="container-wide pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-ink-200 dark:border-ink-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Panel admin</span>
            <h1 className="heading text-4xl sm:text-6xl mt-2">Editorial.</h1>
            <p className="text-ink-600 dark:text-ink-400 mt-2">Revisa, aprueba y mantén la calidad editorial.</p>
          </div>
          <button onClick={fetchAll} className="btn-outline" data-testid="admin-refresh-btn">
            <RefreshCcw size={14}/> Actualizar
          </button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
              data-testid={`admin-stat-${s.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-ink-500">{s.label}</span>
                <s.Icon size={16} className={s.color}/>
              </div>
              <p className={'heading text-4xl ' + s.color}>{s.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-ink-100 dark:bg-ink-900 w-fit mb-8" data-testid="admin-tabs">
          {[
            { k: 'queue', label: `Cola (${queue.length})` },
            { k: 'articles', label: 'Artículos' },
            { k: 'users', label: 'Usuarios' },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => { setTab(t.k); setSearch('') }}
              className={
                'px-5 py-2 rounded-full text-sm font-medium transition-colors ' +
                (tab === t.k ? 'bg-white dark:bg-ink-700 text-ink-900 dark:text-white shadow-sm' : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white')
              }
              data-testid={`admin-tab-${t.k}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {(tab === 'articles' || tab === 'users') && (
          <div className="relative mb-6 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"/>
            <input
              type="text" className="input pl-10 h-11" placeholder="Buscar…"
              value={search} onChange={(e) => { setSearch(e.target.value); setPageA(1); setPageU(1) }}
              data-testid="admin-search-input"
            />
          </div>
        )}

        {/* QUEUE */}
        {tab === 'queue' && (
          <div className="card divide-y divide-ink-200 dark:divide-ink-800 overflow-hidden" data-testid="admin-queue-list">
            {loading ? (
              <div className="p-10 text-center text-ink-500">Cargando…</div>
            ) : queue.length === 0 ? (
              <div className="p-16 text-center">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-4"/>
                <h3 className="heading text-2xl">Cola vacía</h3>
                <p className="text-ink-500 mt-2">No hay artículos esperando revisión. Buen trabajo.</p>
              </div>
            ) : (
              queue.map((a) => (
                <div key={a.id} className="p-6 flex flex-col lg:flex-row lg:items-center gap-4" data-testid={`queue-item-${a.id}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <StatusBadge status={a.status}/>
                      <span className="text-xs font-mono text-ink-500">{a.category}</span>
                      <span className="text-xs text-ink-500">por {a.authorName || a.author}</span>
                    </div>
                    <h3 className="heading text-xl">{a.title}</h3>
                    <p className="text-sm text-ink-500 mt-1 line-clamp-2">{a.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button onClick={() => openReview(a, 'approve')} className="btn bg-emerald-500 hover:bg-emerald-600 text-white" data-testid={`approve-btn-${a.id}`}>
                      <Check size={14}/> Aprobar
                    </button>
                    <button onClick={() => openReview(a, 'request_changes')} className="btn bg-amber-500 hover:bg-amber-600 text-white" data-testid={`review-btn-${a.id}`}>
                      <RefreshCcw size={14}/> Pedir cambios
                    </button>
                    <button onClick={() => openReview(a, 'reject')} className="btn bg-rose-500 hover:bg-rose-600 text-white" data-testid={`reject-btn-${a.id}`}>
                      <X size={14}/> Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ARTICLES */}
        {tab === 'articles' && (
          <>
            <div className="card overflow-hidden" data-testid="admin-articles-table">
              <table className="w-full">
                <thead className="bg-ink-50 dark:bg-ink-900 border-b border-ink-200 dark:border-ink-800">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500">Título</th>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500 hidden md:table-cell">Autor</th>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500">Estado</th>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500 hidden lg:table-cell">Vistas</th>
                    <th className="text-right px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200 dark:divide-ink-800">
                  {pagedArticles.map((a) => (
                    <tr key={a.id} className="hover:bg-ink-50 dark:hover:bg-ink-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-cabinet font-semibold text-ink-900 dark:text-white line-clamp-1">{a.title}</p>
                        <p className="text-xs text-ink-500">{a.category}</p>
                      </td>
                      <td className="px-6 py-4 text-sm hidden md:table-cell text-ink-600 dark:text-ink-400">{a.authorName || a.author}</td>
                      <td className="px-6 py-4"><StatusBadge status={a.status}/></td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm font-mono text-ink-500">{a.views || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-1">
                          {(a.status === 'pending' || a.status === 'in_review') && (
                            <button onClick={() => openReview(a, 'approve')} className="btn-ghost" title="Revisar">
                              <Eye size={14}/>
                            </button>
                          )}
                          <button onClick={() => deleteArticle(a)} className="btn-ghost text-rose-500 hover:bg-rose-500/10" title="Eliminar" data-testid={`delete-article-${a.id}`}>
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pagedArticles.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-ink-500">Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={pageA} total={totalPagesA} count={filteredArticles.length} onChange={setPageA} testid="articles" />
          </>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <>
            <div className="card overflow-hidden" data-testid="admin-users-table">
              <table className="w-full">
                <thead className="bg-ink-50 dark:bg-ink-900 border-b border-ink-200 dark:border-ink-800">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500">Usuario</th>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500 hidden md:table-cell">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500">Rol</th>
                    <th className="text-right px-6 py-3 text-xs font-mono uppercase tracking-widest text-ink-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200 dark:divide-ink-800">
                  {pagedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-ink-50 dark:hover:bg-ink-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center justify-center font-cabinet font-bold text-sm">
                            {u.name?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <p className="font-cabinet font-semibold">{u.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm hidden md:table-cell text-ink-600 dark:text-ink-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={
                          'badge ' + (u.role === 'admin'
                            ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                            : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300')
                        }>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u, e.target.value)}
                          className="input h-9 w-auto text-sm"
                          data-testid={`role-select-${u.id}`}
                        >
                          <option value="user">user</option>
                          <option value="author">author</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {pagedUsers.length === 0 && (
                    <tr><td colSpan={4} className="p-10 text-center text-ink-500">Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={pageU} total={totalPagesU} count={filteredUsers.length} onChange={setPageU} testid="users" />
          </>
        )}
      </div>

      {/* Review modal */}
      <Modal
        open={!!reviewArticle}
        onClose={() => !submitting && setReviewArticle(null)}
        title={
          reviewAction === 'approve' ? 'Aprobar artículo' :
          reviewAction === 'reject' ? 'Rechazar artículo' : 'Pedir cambios'
        }
        size="lg"
      >
        {reviewArticle && (
          <form onSubmit={submitReview} className="space-y-5" data-testid="review-form">
            <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
              <p className="font-cabinet font-bold text-lg">{reviewArticle.title}</p>
              <p className="text-sm text-ink-500 mt-1">por {reviewArticle.authorName || reviewArticle.author} · {reviewArticle.category}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'approve', label: 'Aprobar', cls: 'emerald' },
                { k: 'request_changes', label: 'Pedir cambios', cls: 'amber' },
                { k: 'reject', label: 'Rechazar', cls: 'rose' },
              ].map((opt) => (
                <button
                  key={opt.k}
                  type="button"
                  onClick={() => setReviewAction(opt.k)}
                  className={
                    'px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ' +
                    (reviewAction === opt.k
                      ? (opt.cls === 'emerald' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' :
                         opt.cls === 'amber' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300' :
                         'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300')
                      : 'border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400')
                  }
                  data-testid={`review-action-${opt.k}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">
                Nota {(reviewAction === 'approve') ? '(opcional)' : <span className="text-rose-500">*</span>}
              </label>
              <textarea
                rows={5}
                className="input pt-3 h-auto resize-none"
                placeholder={reviewAction === 'approve' ? 'Comentario opcional…' : 'Explica tu decisión al autor…'}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                data-testid="review-note-input"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-200 dark:border-ink-800">
              <button type="button" onClick={() => setReviewArticle(null)} className="btn-ghost" disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={submitting} data-testid="review-submit-btn">
                {submitting ? 'Enviando…' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function Pagination({ page, total, count, onChange, testid }) {
  if (total <= 1) return null
  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <p className="text-ink-500 font-mono">Página {page} de {total} · {count} resultados</p>
      <div className="flex gap-2">
        <button disabled={page === 1} onClick={() => onChange(page - 1)} className="btn-outline disabled:opacity-40" data-testid={`${testid}-prev-btn`}>
          ← Anterior
        </button>
        <button disabled={page === total} onClick={() => onChange(page + 1)} className="btn-outline disabled:opacity-40" data-testid={`${testid}-next-btn`}>
          Siguiente →
        </button>
      </div>
    </div>
  )
}
