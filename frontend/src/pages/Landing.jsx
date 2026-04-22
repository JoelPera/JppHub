import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowRight, ArrowUpRight, Zap, Eye, CheckCircle2, Shield, LineChart, PenLine,
  Layers, Code2, Star, Sparkles, Check,
} from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { api } from '../lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const features = [
  { Icon: PenLine, title: 'Editor sencillo', desc: 'Escribe con un WYSIWYG limpio. Títulos, imágenes, listas, código. Sin distracciones.' },
  { Icon: CheckCircle2, title: 'Revisión experta', desc: 'Un equipo editorial revisa cada artículo en menos de 24h. Feedback real, no filtros automáticos.' },
  { Icon: Zap, title: 'Publicación instantánea', desc: 'Una vez aprobado, tu artículo aparece en la home y queda indexado para SEO.' },
  { Icon: LineChart, title: 'Estadísticas claras', desc: 'Vistas, clics, tiempo de lectura. Medibles desde tu dashboard, sin noise.' },
  { Icon: Shield, title: 'Roles y permisos', desc: 'Autores, revisores y admins con permisos diferenciados. Seguro por defecto.' },
  { Icon: Layers, title: 'Dashboard profesional', desc: 'Cola de revisión, filtros por estado, acciones en un clic. Para autores y editores.' },
]

const testimonials = [
  {
    quote: 'Publicar aquí fue lo más limpio que he hecho en años. La revisión tardó 8 horas, y aparecí en home con 2.300 lecturas el primer día.',
    author: 'Andrea Torres',
    role: 'ML Engineer, Madrid',
    initials: 'AT',
  },
  {
    quote: 'JppHub es Medium pero con criterio. Por fin un sitio donde el contenido sobre IA no es spam de afiliados.',
    author: 'Javier Luna',
    role: 'Founder · n8n Consultant',
    initials: 'JL',
  },
  {
    quote: 'El editorial hizo tres rondas de feedback conmigo. El artículo final fue 2x mejor de lo que envié. Aquí hay gente que lee.',
    author: 'Paula Ríos',
    role: 'AI Researcher, CDMX',
    initials: 'PR',
  },
]

const faqs = [
  { q: '¿Cuánto tarda la revisión de un artículo?', a: 'Menos de 24h en el plan Pro y menos de 48h en el plan Free. Si pedimos cambios, lo explicamos con notas claras.' },
  { q: '¿Puedo publicar artículos patrocinados?', a: 'Sí, con etiqueta clara de "Patrocinado". Si el contenido aporta valor real al lector, lo aprobamos. El criterio editorial no se vende.' },
  { q: '¿Tengo derechos sobre lo que escribo?', a: 'Siempre. Tú mantienes la autoría y podemos retirar la publicación cuando quieras. Nosotros solo te damos audiencia cualificada.' },
  { q: '¿Cómo se factura el plan Pro?', a: 'Mensual o anual con 2 meses gratis. Cancelas cuando quieras desde el dashboard, sin permanencias.' },
]

export default function Landing() {
  const [articles, setArticles] = useState([])
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.getPublishedArticles()
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoadingArticles(false))
  }, [])

  const submitContact = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.sendContact(contact)
      toast.success('Mensaje enviado. Te respondemos en menos de 24h.')
      setContact({ name: '', email: '', message: '' })
    } catch (err) {
      toast.error(err.message || 'No pudimos enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  return (
    <PublicLayout>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-10 sm:pt-20">
        <div className="absolute inset-0 grid-pattern opacity-40 text-ink-900 dark:text-white pointer-events-none" />
        <div className="container-wide relative">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-200 dark:border-ink-800 bg-white/60 dark:bg-ink-900/60 backdrop-blur text-xs font-mono uppercase tracking-widest text-ink-600 dark:text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Curado por expertos · Publicado al instante
            </motion.div>

            <motion.h1 variants={fadeUp} className="heading text-5xl sm:text-7xl lg:text-[5.5rem] mt-6 leading-[1.02]">
              Publica sobre IA<br/>
              <span className="italic font-serif font-normal text-ink-700 dark:text-ink-300">para gente que</span><br/>
              <span className="relative inline-block">
                lee de verdad.
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 400 12" preserveAspectRatio="none">
                  <path d="M2 9 Q 100 2 200 7 T 398 6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-accent"/>
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-ink-600 dark:text-ink-400 mt-8 max-w-2xl leading-relaxed">
              JppHub es un SaaS editorial. Envía tu artículo, nuestro equipo lo revisa, y si aporta valor
              aparece publicado para miles de lectores cualificados en IA y automatización.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/register" className="btn-primary btn-lg group" data-testid="hero-cta-register">
                Crear cuenta gratis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#demo" className="btn-outline btn-lg" data-testid="hero-cta-demo">
                Ver cómo funciona
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-16 grid grid-cols-3 gap-8 sm:gap-16 max-w-2xl">
              {[
                { num: '250+', label: 'Autores activos' },
                { num: '1.2k', label: 'Artículos publicados' },
                { num: '<24h', label: 'Tiempo revisión Pro' },
              ].map((s, i) => (
                <div key={i} className="border-t border-ink-900 dark:border-white pt-4">
                  <p className="heading text-4xl sm:text-5xl" data-testid={`stat-${i}`}>{s.num}</p>
                  <p className="text-xs font-mono uppercase tracking-widest text-ink-500 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ LOGOS MARQUEE ============ */}
      <section className="mt-24 sm:mt-32 border-y border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900/40 overflow-hidden">
        <div className="container-wide py-8">
          <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-ink-500 mb-8">
            Autores que publican con nosotros trabajan en
          </p>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap gap-16 items-center opacity-70">
              {[...Array(2)].map((_, k) => (
                <div key={k} className="flex gap-16 items-center shrink-0">
                  {['OpenAI', 'Stripe', 'n8n', 'Vercel', 'Notion', 'Linear', 'Anthropic', 'Hugging Face'].map((brand) => (
                    <span key={brand} className="font-cabinet font-bold text-2xl text-ink-700 dark:text-ink-300 shrink-0">
                      {brand}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ DEMO / DASHBOARD PREVIEW ============ */}
      <section id="demo" className="container-wide py-24 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Flujo editorial</span>
            <h2 className="heading text-4xl sm:text-6xl mt-3 leading-[1.05]">
              Escribe. Revisamos.<br/>
              <span className="italic font-serif font-normal text-ink-500">Se publica.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-lg text-ink-600 dark:text-ink-400 leading-relaxed">
            Tres pasos. Cero fricción. El editor revisa, tú iteras si hace falta, y la aprobación
            se traduce en publicación instantánea con SEO, detalle de artículo y métricas.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-lift overflow-hidden"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950">
            <span className="w-3 h-3 rounded-full bg-rose-400"/>
            <span className="w-3 h-3 rounded-full bg-amber-400"/>
            <span className="w-3 h-3 rounded-full bg-emerald-400"/>
            <span className="ml-4 font-mono text-xs text-ink-500">jpphub.com/admin — Cola de revisión</span>
          </div>
          <div className="grid md:grid-cols-12 gap-0">
            {/* Sidebar */}
            <div className="md:col-span-3 border-r border-ink-200 dark:border-ink-800 p-6 bg-ink-50/50 dark:bg-ink-950/50">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">Navegación</p>
              <nav className="space-y-1 text-sm">
                <div className="px-3 py-2 rounded-lg bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-medium">Cola de revisión</div>
                <div className="px-3 py-2 rounded-lg text-ink-600 dark:text-ink-400">Artículos</div>
                <div className="px-3 py-2 rounded-lg text-ink-600 dark:text-ink-400">Autores</div>
                <div className="px-3 py-2 rounded-lg text-ink-600 dark:text-ink-400">Estadísticas</div>
              </nav>
              <div className="mt-8 p-4 rounded-xl border border-ink-200 dark:border-ink-800">
                <p className="text-xs text-ink-500 font-mono uppercase tracking-widest">Pendientes</p>
                <p className="heading text-3xl mt-1">14</p>
              </div>
            </div>

            {/* Main content */}
            <div className="md:col-span-9 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading text-xl">Cola de revisión</h3>
                <div className="flex gap-2">
                  <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> 14 pendientes</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { t: 'El impacto de la IA en los negocios 2026', a: 'Marta Sánchez', s: 'pending' },
                  { t: 'Automatiza tu negocio con n8n en 7 pasos', a: 'Javier Luna', s: 'in_review' },
                  { t: 'Prompt engineering avanzado con GPT-5', a: 'Paula Ríos', s: 'approved' },
                  { t: 'Stack SaaS 2026: FastAPI + React + Postgres', a: 'Andrea Torres', s: 'pending' },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-ink-200 dark:border-ink-800 hover:border-ink-900 dark:hover:border-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center font-cabinet font-bold text-sm shrink-0">
                      {p.a.split(' ').map(n => n[0]).slice(0,2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cabinet font-semibold text-ink-900 dark:text-white truncate">{p.t}</p>
                      <p className="text-sm text-ink-500">{p.a}</p>
                    </div>
                    <span className={
                      'badge shrink-0 ' + (
                        p.s === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        p.s === 'in_review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300'
                      )
                    }>
                      <span className={
                        'w-1.5 h-1.5 rounded-full ' + (
                          p.s === 'approved' ? 'bg-emerald-500' :
                          p.s === 'in_review' ? 'bg-amber-500' : 'bg-slate-400'
                        )
                      }/>
                      {p.s === 'approved' ? 'Aprobado' : p.s === 'in_review' ? 'En revisión' : 'Pendiente'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ FEATURES GRID (BENTO) ============ */}
      <section id="features" className="container-wide py-24 sm:py-32 border-t border-ink-200 dark:border-ink-800">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Producto</span>
          <h2 className="heading text-4xl sm:text-6xl mt-3 leading-[1.05]">
            Todo lo que necesitas<br/>
            <span className="italic font-serif font-normal text-ink-500">para publicar bien.</span>
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid md:grid-cols-6 gap-4"
        >
          {features.map((f, i) => (
            <motion.article
              key={i}
              variants={fadeUp}
              className={
                'card p-7 sm:p-9 group hover:-translate-y-1 hover:shadow-lift ' +
                (i === 0 ? 'md:col-span-3 md:row-span-2' : 'md:col-span-3')
              }
              data-testid={`feature-card-${i}`}
            >
              <div className="w-12 h-12 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.Icon size={20} strokeWidth={2}/>
              </div>
              <h3 className="heading text-2xl mb-3">{f.title}</h3>
              <p className="text-ink-600 dark:text-ink-400 leading-relaxed">{f.desc}</p>
              {i === 0 && (
                <div className="mt-8 p-5 rounded-xl bg-ink-50 dark:bg-ink-950 font-mono text-sm text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-800">
                  <p className="text-ink-400 text-xs mb-2">// editor.md</p>
                  <p># Hola mundo</p>
                  <p className="text-ink-500">**JppHub** filtra el ruido.</p>
                  <p className="text-ink-500">- [x] Escribe</p>
                  <p className="text-ink-500">- [x] Publica</p>
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ============ LATEST ARTICLES ============ */}
      <section className="container-wide py-24 sm:py-32 border-t border-ink-200 dark:border-ink-800">
        <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Últimos artículos</span>
            <h2 className="heading text-4xl sm:text-5xl mt-3">Contenido aprobado por editorial.</h2>
          </div>
          <Link to="/articulos" className="btn-outline" data-testid="landing-see-all-articles">
            Ver todos <ArrowUpRight size={16}/>
          </Link>
        </div>

        {loadingArticles ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-7 animate-pulse">
                <div className="h-4 w-20 bg-ink-200 dark:bg-ink-800 rounded mb-4"/>
                <div className="h-6 w-4/5 bg-ink-200 dark:bg-ink-800 rounded mb-2"/>
                <div className="h-6 w-3/5 bg-ink-200 dark:bg-ink-800 rounded mb-6"/>
                <div className="h-3 w-32 bg-ink-200 dark:bg-ink-800 rounded"/>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-ink-500">Aún no hay artículos publicados. ¡Sé el primero!</p>
            <Link to="/register" className="btn-primary mt-5 inline-flex">Empezar a publicar</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/articulos/${a.slug}`}
                  className="card p-7 block group hover:-translate-y-1 hover:shadow-lift h-full"
                  data-testid={`landing-article-${a.slug}`}
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
                    <ArrowUpRight size={16} className="text-ink-400 group-hover:text-ink-900 dark:group-hover:text-white group-hover:rotate-0 -rotate-45 transition-all"/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="container-wide py-24 sm:py-32 border-t border-ink-200 dark:border-ink-800">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Testimonios</span>
          <h2 className="heading text-4xl sm:text-6xl mt-3 leading-[1.05]">
            Lo dicen quienes<br/>
            <span className="italic font-serif font-normal text-ink-500">ya publican aquí.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-8 flex flex-col"
            >
              <div className="flex gap-0.5 text-amber-400 mb-5">
                {[...Array(5)].map((_, k) => <Star key={k} size={14} fill="currentColor" strokeWidth={0}/>)}
              </div>
              <p className="text-lg font-serif leading-relaxed text-ink-800 dark:text-ink-200 mb-6 flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-200 dark:border-ink-800">
                <div className="w-11 h-11 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center justify-center font-cabinet font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-cabinet font-semibold text-ink-900 dark:text-white">{t.author}</p>
                  <p className="text-sm text-ink-500">{t.role}</p>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="container-wide py-24 sm:py-32 border-t border-ink-200 dark:border-ink-800">
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Precios</span>
          <h2 className="heading text-4xl sm:text-6xl mt-3 leading-[1.05]">
            Empieza gratis.<br/>
            <span className="italic font-serif font-normal text-ink-500">Escala cuando quieras.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: 'Free',
              price: '0',
              desc: 'Para probar el flujo editorial.',
              features: ['3 artículos / mes', 'Revisión en 48h', 'Dashboard personal', 'Estadísticas básicas'],
              cta: 'Empezar gratis',
              featured: false,
              testid: 'plan-free',
            },
            {
              name: 'Pro',
              price: '19',
              desc: 'Para autores serios que publican regularmente.',
              features: ['Artículos ilimitados', 'Revisión prioritaria <24h', 'Estadísticas avanzadas', 'Soporte dedicado', 'Destacado en home'],
              cta: 'Empezar Pro',
              featured: true,
              testid: 'plan-pro',
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              desc: 'Para equipos y publicaciones corporativas.',
              features: ['Múltiples autores', 'SLA dedicado', 'Integraciones a medida', 'Branded newsletter', 'Soporte 24/7'],
              cta: 'Hablemos',
              featured: false,
              testid: 'plan-enterprise',
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={
                'card p-8 sm:p-10 flex flex-col relative ' +
                (p.featured ? 'bg-ink-900 text-white border-ink-900 dark:bg-white dark:text-ink-900 dark:border-white md:-mt-4 md:mb-4 shadow-lift' : '')
              }
              data-testid={p.testid}
            >
              {p.featured && (
                <span className="absolute top-0 right-6 -translate-y-1/2 badge bg-amber-400 text-ink-900 font-bold">
                  <Sparkles size={12}/> Más popular
                </span>
              )}
              <h3 className="heading text-2xl">{p.name}</h3>
              <p className={(p.featured ? 'text-white/70 dark:text-ink-600' : 'text-ink-500') + ' mt-2'}>{p.desc}</p>
              <div className="mt-6 mb-8">
                <span className="heading text-6xl">{p.price === 'Custom' ? 'Custom' : '$' + p.price}</span>
                {p.price !== 'Custom' && <span className={(p.featured ? 'text-white/60 dark:text-ink-500' : 'text-ink-500') + ' ml-2'}>/mes</span>}
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {p.features.map((f, k) => (
                  <li key={k} className="flex items-start gap-3">
                    <span className={'mt-1 w-4 h-4 rounded-full inline-flex items-center justify-center shrink-0 ' + (p.featured ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white' : 'bg-ink-900 dark:bg-white text-white dark:text-ink-900')}>
                      <Check size={10} strokeWidth={3}/>
                    </span>
                    <span className={p.featured ? 'text-white/90 dark:text-ink-700' : 'text-ink-700 dark:text-ink-300'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={p.name === 'Enterprise' ? '#contacto' : '/register'}
                className={p.featured ? 'btn btn-lg bg-white text-ink-900 hover:bg-ink-100 dark:bg-ink-900 dark:text-white dark:hover:bg-ink-800 w-full' : 'btn-outline btn-lg w-full'}
                data-testid={`${p.testid}-cta`}
              >
                {p.cta} <ArrowRight size={16}/>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="container-tight py-24 sm:py-32 border-t border-ink-200 dark:border-ink-800">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ FAQ</span>
            <h2 className="heading text-4xl sm:text-5xl mt-3 leading-[1.05]">Dudas frecuentes.</h2>
            <p className="text-ink-600 dark:text-ink-400 mt-4">¿Algo que no está aquí? Escríbenos más abajo.</p>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="card p-6 group" data-testid={`faq-${i}`}>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="heading text-lg pr-6">{f.q}</span>
                  <span className="w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center group-open:rotate-45 transition-transform">
                    <span className="text-2xl leading-none">+</span>
                  </span>
                </summary>
                <p className="text-ink-600 dark:text-ink-400 mt-4 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contacto" className="container-tight py-24 sm:py-32 border-t border-ink-200 dark:border-ink-800">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">/ Contacto</span>
            <h2 className="heading text-4xl sm:text-6xl mt-3 leading-[1.05]">
              ¿Dudas?<br/>
              <span className="italic font-serif font-normal text-ink-500">Hablemos.</span>
            </h2>
            <p className="text-ink-600 dark:text-ink-400 mt-6 text-lg">
              Respondemos todos los mensajes en menos de 24h. Sea feedback, propuestas o integraciones.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 flex items-center justify-center">@</span>
                hola@jpphub.com
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 flex items-center justify-center"><Code2 size={14}/></span>
                Partnership & API
              </div>
            </div>
          </div>

          <form onSubmit={submitContact} className="lg:col-span-7 card p-8 sm:p-10 space-y-5" data-testid="contact-form">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Nombre</label>
              <input
                type="text" required className="input" placeholder="Tu nombre"
                value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })}
                data-testid="contact-name-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Email</label>
              <input
                type="email" required className="input" placeholder="tu@email.com"
                value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })}
                data-testid="contact-email-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">Mensaje</label>
              <textarea
                required rows={5} className="input pt-3 h-auto resize-none" placeholder="Cuéntanos..."
                value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })}
                data-testid="contact-message-input"
              />
            </div>
            <button type="submit" disabled={sending} className="btn-primary btn-lg w-full" data-testid="contact-submit-btn">
              {sending ? 'Enviando…' : 'Enviar mensaje'}
              <ArrowRight size={16}/>
            </button>
          </form>
        </div>
      </section>
    </PublicLayout>
  )
}
