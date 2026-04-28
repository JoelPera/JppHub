import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Eye, Calendar, ArrowLeft, Settings } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { api } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function AuthorPublic() {
  const { id } = useParams()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getPublicProfile(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <PublicLayout>
        <div className="container-tight pt-24 pb-20">
          <div className="flex items-center gap-6 animate-pulse mb-10">
            <div className="w-24 h-24 rounded-full bg-ink-200 dark:bg-ink-800"/>
            <div className="flex-1 space-y-3">
              <div className="h-8 w-48 bg-ink-200 dark:bg-ink-800 rounded"/>
              <div className="h-4 w-32 bg-ink-200 dark:bg-ink-800 rounded"/>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!data?.profile) {
    return (
      <PublicLayout>
        <div className="container-tight pt-32 pb-20 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-500">404 · Autor no encontrado</span>
          <h1 className="heading text-5xl mt-4">Este autor no existe</h1>
          <Link to="/articulos" className="btn-primary btn-lg mt-8" data-testid="author-notfound-back">
            <ArrowLeft size={16}/> Ver artículos
          </Link>
        </div>
      </PublicLayout>
    )
  }

  const { profile, articles } = data
  const isMe = user?.id === profile.id
  const initials = (profile.name || 'A').split(' ').map((n) => n[0]).slice(0, 2).join('')

  return (
    <PublicLayout>
      <div className="container-wide pt-16 pb-24">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-[auto,1fr,auto] gap-8 items-center pb-10 mb-12 border-b border-ink-200 dark:border-ink-800"
        >
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-28 h-28 rounded-full object-cover border border-ink-200 dark:border-ink-800"/>
          ) : (
            <div className="w-28 h-28 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center justify-center font-cabinet font-bold text-4xl">
              {initials}
            </div>
          )}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Autor</span>
            <h1 className="heading text-4xl sm:text-6xl mt-2" data-testid="author-name">{profile.name}</h1>
            {profile.bio ? (
              <p className="text-ink-600 dark:text-ink-400 mt-3 text-lg max-w-2xl leading-relaxed font-serif italic" data-testid="author-bio">
                "{profile.bio}"
              </p>
            ) : (
              <p className="text-ink-500 mt-3 italic">Sin bio todavía.</p>
            )}
            <div className="flex items-center gap-4 mt-5 text-sm text-ink-500 flex-wrap">
              <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">{profile.role}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14}/>Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
              <span>·</span>
              <span>{articles.length} {articles.length === 1 ? 'artículo publicado' : 'artículos publicados'}</span>
            </div>
          </div>
          {isMe && (
            <Link to="/perfil" className="btn-outline" data-testid="author-edit-profile-btn">
              <Settings size={14}/> Editar perfil
            </Link>
          )}
        </motion.section>

        {/* Articles */}
        <div>
          <h2 className="heading text-3xl sm:text-4xl mb-8">Artículos de {profile.name.split(' ')[0]}</h2>
          {articles.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-ink-500">Este autor aún no tiene artículos publicados.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="author-articles-grid">
              {articles.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                >
                  <Link
                    to={`/articulos/${a.slug}`}
                    className="card overflow-hidden block group hover:-translate-y-1 hover:shadow-lift h-full"
                    data-testid={`author-article-${a.slug}`}
                  >
                    {a.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      </div>
                    )}
                    <div className="p-7">
                      <div className="flex items-center justify-between mb-4">
                        <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
                          {a.category || 'General'}
                        </span>
                        <span className="text-xs font-mono text-ink-400 flex items-center gap-1">
                          <Eye size={12}/> {a.views || 0}
                        </span>
                      </div>
                      <h3 className="heading text-xl leading-tight mb-3 group-hover:underline underline-offset-4 decoration-2">
                        {a.title}
                      </h3>
                      <p className="text-ink-600 dark:text-ink-400 line-clamp-2 text-sm leading-relaxed">{a.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
