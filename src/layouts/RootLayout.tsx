import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { PageTransition } from '../animations/PageTransition'
import { SiteTopBar } from '../components/SiteTopBar'

export function RootLayout() {
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-bg">
      <SiteTopBar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname} className="min-h-dvh pt-12">
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
