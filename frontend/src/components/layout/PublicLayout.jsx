import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout({ children, hideFooter = false }) {
  return (
    <div className="min-h-full flex flex-col bg-white dark:bg-ink-950">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}
