import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  const sizeCls = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }[size] || 'max-w-xl'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div className={cn('relative w-full card shadow-lift animate-fade-up', sizeCls)} data-testid="modal">
        <div className="flex items-center justify-between p-6 border-b border-ink-200 dark:border-ink-800">
          <h3 className="heading text-2xl">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 inline-flex items-center justify-center"
            aria-label="Cerrar"
            data-testid="modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
