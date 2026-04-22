import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, Calendar, Clock, Share2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import PublicLayout from '../components/layout/PublicLayout'
import { api } from '../lib/api'

function readingTime(html = '') {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return '' }
}

export default function ArticleDetail() {
  const { slug } = useParams()
  const nav = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.getArticleBySlug(slug)
      .then(async (a) => {
        setArticle(a)
        if (a?.id) api.incrementViews(a.id).catch(() => {})
      })
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [slug])

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success('Enlace copiado')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="container-tight pt-24 pb-20">
          <div className="h-4 w-24 bg-ink-200 dark:bg-ink-800 rounded mb-6 animate-pulse"/>
          <div className="h-14 w-3/4 bg-ink-200 dark:bg-ink-800 rounded mb-4 animate-pulse"/>
          <div className="h-14 w-2/4 bg-ink-200 dark:bg-ink-800 rounded mb-10 animate-pulse"/>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-ink-100 dark:bg-ink-900 rounded animate-pulse"/>
            ))}
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!article) {
    return (
      <PublicLayout>
        <div className="container-tight pt-32 pb-20 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-500">404 · No encontrado</span>
          <h1 className="heading text-5xl mt-4">Este artículo no existe</h1>
          <p className="text-ink-500 mt-4">Puede que haya sido retirado o que el enlace sea incorrecto.</p>
          <button onClick={() => nav('/articulos')} className="btn-primary btn-lg mt-8" data-testid="article-notfound-back">
            <ArrowLeft size={16}/> Ver todos los artículos
          </button>
        </div>
      </PublicLayout>
    )
  }

  const rt = readingTime(article.content)

  return (
    <PublicLayout>
      <article className="container-tight pt-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/articulos" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white mb-10" data-testid="article-back-link">
            <ArrowLeft size={14}/> Volver a artículos
          </Link>

          <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
            {article.category || 'General'}
          </span>

          <h1 className="heading text-4xl sm:text-6xl lg:text-7xl mt-6 leading-[1.05] tracking-tight" data-testid="article-title">
            {article.title}
          </h1>

          <p className="font-serif text-2xl sm:text-3xl text-ink-600 dark:text-ink-400 mt-6 leading-relaxed italic">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 pb-10 border-b border-ink-200 dark:border-ink-800 text-sm text-ink-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center justify-center font-cabinet font-bold">
                {(article.authorName || article.author || 'A').split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="font-cabinet font-semibold text-ink-900 dark:text-white">{article.authorName || article.author || 'Anónimo'}</p>
                <p className="text-xs">Autor</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5"><Calendar size={14}/> {formatDate(article.publishedAt || article.createdAt)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14}/> {rt} min de lectura</span>
            <span className="flex items-center gap-1.5"><Eye size={14}/> {article.views || 0}</span>
            <button onClick={share} className="ml-auto btn-outline" data-testid="article-share-btn">
              {copied ? <><Check size={14}/> Copiado</> : <><Share2 size={14}/> Compartir</>}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose-editorial mt-14"
          data-testid="article-content"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />

        <div className="mt-20 pt-10 border-t border-ink-200 dark:border-ink-800 flex items-center justify-between">
          <Link to="/articulos" className="btn-outline" data-testid="article-back-btn">
            <ArrowLeft size={14}/> Más artículos
          </Link>
          <button onClick={share} className="btn-primary" data-testid="article-share-btn-bottom">
            <Share2 size={14}/> Compartir
          </button>
        </div>
      </article>
    </PublicLayout>
  )
}
