import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AmbientVerticalLines } from '../components/AmbientVerticalLines'
import { SiteFooter } from '../components/SiteFooter'
import { SiteTopBar } from '../components/SiteTopBar'

export function RootLayout() {
  const location = useLocation()
  const hideSiteTopBar = /^\/case-study(\/|$)/.test(location.pathname) || /^\/sidequest(\/|$)/.test(location.pathname)
  const isHome = location.pathname === '/'
  const isLeaderboard = location.pathname === '/leaderboard'
  const isPrivacy = location.pathname === '/privacy'
  const isSideQuestViewer = /^\/sidequest(\/|$)/.test(location.pathname)

  /** React Router does not reset scroll; case-study (and other) navigations would keep the old offset. */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-bg" />
        <div className="figma-ambient-lines-shell">
          <div className="relative min-h-dvh w-full">
            <AmbientVerticalLines />
          </div>
        </div>
      </div>
      <div className="relative z-10 flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-clip">
        {hideSiteTopBar ? null : <SiteTopBar />}
        <div className="flex min-h-0 w-full flex-1 flex-col">
          <Outlet />
        </div>
        {/* Progressive bottom-edge blur: off on home so the grid isn’t capped by a frosted “peak”. */}
        {isHome || isLeaderboard || isPrivacy || isSideQuestViewer ? null : (
          <div className="viewport-bottom-blur-stack" aria-hidden>
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--1" />
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--2" />
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--3" />
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--4" />
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--5" />
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--6" />
            <div className="viewport-bottom-blur-layer viewport-bottom-blur-layer--7" />
          </div>
        )}
        {isSideQuestViewer ? null : <SiteFooter />}
      </div>
    </>
  )
}
