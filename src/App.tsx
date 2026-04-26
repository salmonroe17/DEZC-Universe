import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CustomCursor } from './components/CustomCursor'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HudShooterProvider } from './contexts/HudShooterProvider'
import { SiteThemeProvider } from './contexts/SiteThemeProvider'
import { RootLayout } from './layouts/RootLayout'

const Home = lazy(() => import('./pages/Home'))
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const SuperAppShowcasePage = lazy(() => import('./pages/SuperAppShowcasePage'))
const IbmEnviziShowcasePage = lazy(() => import('./pages/IbmEnviziShowcasePage'))
const DesignSystemsShowcasePage = lazy(() => import('./pages/DesignSystemsShowcasePage'))
const CaseStudyComponentsPage = lazy(() => import('./pages/CaseStudyComponentsPage'))
const SideQuestViewerPage = lazy(() => import('./pages/SideQuestViewerPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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
