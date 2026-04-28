import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="container-tight min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-ink-500">Error 404</span>
        <h1 className="heading text-6xl sm:text-8xl mt-4">Perdidos en el flujo</h1>
        <p className="text-ink-600 dark:text-ink-400 mt-4 text-lg max-w-md">
          La página que buscas no existe o fue movida. Vuelve al inicio y sigue explorando artículos.
        </p>
        <Link to="/" className="btn-primary btn-lg mt-8" data-testid="notfound-home-btn">Volver al inicio →</Link>
      </div>
    </PublicLayout>
  )
}
