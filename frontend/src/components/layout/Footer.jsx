import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950" data-testid="footer">
      <div className="container-wide py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-cabinet font-bold text-xl">
              J
            </span>
            <span className="heading text-2xl">JppHub</span>
          </Link>
          <p className="text-ink-600 dark:text-ink-400 max-w-sm leading-relaxed">
            La plataforma editorial SaaS donde expertos publican sobre IA y automatización.
            Contenido curado, publicado al instante.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[
              { Icon: Twitter, href: 'https://twitter.com' },
              { Icon: Linkedin, href: 'https://linkedin.com' },
              { Icon: Github, href: 'https://github.com' },
              { Icon: Mail, href: 'mailto:hola@jpphub.com' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 inline-flex items-center justify-center hover:bg-ink-900 hover:text-white dark:hover:bg-white dark:hover:text-ink-900 transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-cabinet font-bold text-sm uppercase tracking-wider text-ink-900 dark:text-white mb-4">Producto</h4>
          <ul className="space-y-2.5 text-ink-600 dark:text-ink-400 text-sm">
            <li><Link to="/articulos" className="hover:text-ink-900 dark:hover:text-white">Artículos</Link></li>
            <li><a href="/#features" className="hover:text-ink-900 dark:hover:text-white">Features</a></li>
            <li><a href="/#pricing" className="hover:text-ink-900 dark:hover:text-white">Precios</a></li>
            <li><Link to="/register" className="hover:text-ink-900 dark:hover:text-white">Empezar gratis</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-cabinet font-bold text-sm uppercase tracking-wider text-ink-900 dark:text-white mb-4">Empresa</h4>
          <ul className="space-y-2.5 text-ink-600 dark:text-ink-400 text-sm">
            <li><a href="/#contacto" className="hover:text-ink-900 dark:hover:text-white">Contacto</a></li>
            <li><a href="/#faq" className="hover:text-ink-900 dark:hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-ink-900 dark:hover:text-white">Términos</a></li>
            <li><a href="#" className="hover:text-ink-900 dark:hover:text-white">Privacidad</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-cabinet font-bold text-sm uppercase tracking-wider text-ink-900 dark:text-white mb-4">Categorías</h4>
          <ul className="space-y-2.5 text-ink-600 dark:text-ink-400 text-sm">
            <li>Inteligencia Artificial</li>
            <li>Automatización</li>
            <li>SaaS</li>
            <li>No-code</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-200 dark:border-ink-800">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-500">
          <p>© {new Date().getFullYear()} JppHub · Todos los derechos reservados.</p>
          <p className="font-mono text-xs">Construido con pasión por IA y automatización</p>
        </div>
      </div>
    </footer>
  )
}
