import { motion } from 'framer-motion'

export default function ProtectedLayout({ children, title, subtitle, actions }) {
  return (
    <div className="container-wide pt-28 pb-20 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-ink-200 dark:border-ink-800"
      >
        <div>
          {title && <h1 className="heading text-4xl sm:text-5xl">{title}</h1>}
          {subtitle && <p className="text-ink-600 dark:text-ink-400 mt-2 text-lg">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </motion.div>
      {children}
    </div>
  )
}
