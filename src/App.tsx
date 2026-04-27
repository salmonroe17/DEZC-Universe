import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CustomCursor } from './components/CustomCursor'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HudShooterProvider } from './contexts/HudShooterProvider'
import { SiteThemeProvider } from './contexts/SiteThemeProvider'
import { RootLayout } from './layouts/RootLayout'
import { lazyWithRetry } from './lib/lazyWithRetry'

const Home = lazyWithRetry(() => import('./pages/Home'))
const CaseStudyPage = lazyWithRetry(() => import('./pages/CaseStudyPage'))
const SuperAppShowcasePage = lazyWithRetry(() => import('./pages/SuperAppShowcasePage'))
const IbmEnviziShowcasePage = lazyWithRetry(() => import('./pages/IbmEnviziShowcasePage'))
const DesignSystemsShowcasePage = lazyWithRetry(() => import('./pages/DesignSystemsShowcasePage'))
const CaseStudyComponentsPage = lazyWithRetry(() => import('./pages/CaseStudyComponentsPage'))
const SideQuestViewerPage = lazyWithRetry(() => import('./pages/SideQuestViewerPage'))
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'))
const GlobalLeaderboardPage = lazyWithRetry(() => import('./pages/GlobalLeaderboardPage'))
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center font-mono text-xs text-fg-muted">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteThemeProvider>
        <HudShooterProvider>
          <BrowserRouter>
            <CustomCursor />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<Home />} />
                  <Route
                    path="case-study/carbon-neutral-club"
                    element={<CaseStudyPage />}
                  />
                  <Route path="case-study/super-app" element={<SuperAppShowcasePage />} />
                  <Route path="case-study/ibm-envizi" element={<IbmEnviziShowcasePage />} />
                  <Route path="case-study/design-systems" element={<DesignSystemsShowcasePage />} />
                  <Route
                    path="case-study/components"
                    element={<CaseStudyComponentsPage />}
                  />
                  <Route path="sidequest/:sidequestId" element={<SideQuestViewerPage />} />
                  <Route path="leaderboard" element={<GlobalLeaderboardPage />} />
                  <Route path="privacy" element={<PrivacyPolicyPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </HudShooterProvider>
      </SiteThemeProvider>
    </ErrorBoundary>
  )
}
