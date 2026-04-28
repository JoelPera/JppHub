import { cn } from '../../lib/cn'

const map = {
  approved: { label: 'Aprobado', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', dot: 'bg-emerald-500' },
  pending: { label: 'Pendiente', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300', dot: 'bg-slate-500' },
  in_review: { label: 'En revisión', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', dot: 'bg-amber-500' },
  rejected: { label: 'Rechazado', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400', dot: 'bg-rose-500' },
  draft: { label: 'Borrador', cls: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300', dot: 'bg-ink-400' },
}

export default function StatusBadge({ status, className }) {
  const cfg = map[status] || { label: status, cls: 'bg-ink-100 text-ink-700', dot: 'bg-ink-400' }
  return (
    <span className={cn('badge', cfg.cls, className)} data-testid={`status-badge-${status}`}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}
