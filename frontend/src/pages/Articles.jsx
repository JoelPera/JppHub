import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowUpRight, Eye, X } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { api } from '../lib/api'

export default function Articles() {
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('recent')

  useEffect(() => {
    api.getPublishedArticles().then(setAll).catch(() => setAll([])).finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const s = new Set(all.map((a) => a.category).filter(Boolean))
    return ['all', ...Array.from(s)]
  }, [all])

  const filtered = useMemo(() => {
    let r = all
    if (q.trim()) {
      const needle = q.toLowerCase()
      r = r.filter((a) => (a.title + ' ' + (a.description || '') + ' ' + (a.authorName || '')).toLowerCase().includes(needle))
    }
    if (category !== 'all') r = r.filter((a) => a.category === category)
    if (sort === 'views') r = [...r].sort((x, y) => (y.views || 0) - (x.views || 0))
    else r = [...r].sort((x, y) => new Date(y.publishedAt || y.createdAt) - new Date(x.publishedAt || x.createdAt))
    return r
  }, [all, q, category, sort])

  return (
    <PublicLayout>
      <div className="container-wide pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Biblioteca</span>
          <h1 className="heading text-5xl sm:text-7xl mt-3 leading-[1.02]">
            Artículos publicados.
          </h1>
          <p className="text-ink-600 dark:text-ink-400 mt-4 text-lg max-w-2xl">
            Contenido validado por nuestro equipo editorial. IA, automatización, SaaS, no-code.
          </p>
        </motion.div>
      </div>

      <div className="sticky top-16 z-30 backdrop-blur-xl bg-white/80 dark:bg-ink-950/80 border-y border-ink-200 dark:border-ink-800">
        <div className="container-wide py-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"/>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar artículos…"
              className="input pl-10 pr-10 h-11"
              data-testid="articles-search-input"
            />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 dark:hover:text-white">
                <X size={14}/>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ' +
                  (category === c
                    ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700')
                }
                data-testid={`category-filter-${c}`}
              >
                {c === 'all' ? 'Todas' : c}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input h-11 w-auto text-sm"
            data-testid="articles-sort"
          >
            <option value="recent">Más recientes</option>
            <option value="views">Más leídos</option>
          </select>
        </div>
      </div>

      <div className="container-wide py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-7 animate-pulse">
                <div className="h-4 w-20 bg-ink-200 dark:bg-ink-800 rounded mb-4"/>
                <div className="h-6 w-4/5 bg-ink-200 dark:bg-ink-800 rounded mb-2"/>
                <div className="h-6 w-3/5 bg-ink-200 dark:bg-ink-800 rounded mb-6"/>
                <div className="h-3 w-32 bg-ink-200 dark:bg-ink-800 rounded"/>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-500">Sin resultados</p>
            <h3 className="heading text-3xl mt-3">No encontramos nada.</h3>
            <p className="text-ink-500 mt-3">Prueba con otra búsqueda o categoría.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-500 font-mono mb-6" data-testid="articles-count">
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="articles-grid">
              {filtered.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                >
                  <Link
                    to={`/articulos/${a.slug}`}
                    className="card p-7 block group hover:-translate-y-1 hover:shadow-lift h-full"
                    data-testid={`article-card-${a.slug}`}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
                        {a.category || 'General'}
                      </span>
                      <span className="text-xs font-mono text-ink-400 flex items-center gap-1">
                        <Eye size={12}/> {a.views || 0}
                      </span>
                    </div>
                    <h3 className="heading text-2xl leading-tight mb-3 group-hover:underline underline-offset-4 decoration-2">
                      {a.title}
                    </h3>
                    <p className="text-ink-600 dark:text-ink-400 line-clamp-3 mb-6 leading-relaxed">{a.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-ink-200 dark:border-ink-800">
                      <span className="text-sm text-ink-500">{a.authorName || a.author}</span>
                      <ArrowUpRight size={16} className="text-ink-400 group-hover:text-ink-900 dark:group-hover:text-white transition-all"/>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  )
}
