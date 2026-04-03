import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { PageTransition } from '../animations/PageTransition'
import { SiteTopBar } from '../components/SiteTopBar'

export function RootLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <SiteTopBar />
      <AnimatePresence mode="wait">
        <PageTransition
          key={location.pathname}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
