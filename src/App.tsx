import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CustomCursor } from './components/CustomCursor'
import { HudShooterProvider } from './contexts/HudShooterProvider'
import { SiteThemeProvider } from './contexts/SiteThemeProvider'
import { RootLayout } from './layouts/RootLayout'
import CaseStudyComponentsPage from './pages/CaseStudyComponentsPage'
import CaseStudyPage from './pages/CaseStudyPage'
import DesignSystemsShowcasePage from './pages/DesignSystemsShowcasePage'
import Home from './pages/Home'
import IbmEnviziShowcasePage from './pages/IbmEnviziShowcasePage'
import SideQuestViewerPage from './pages/SideQuestViewerPage'
import SuperAppShowcasePage from './pages/SuperAppShowcasePage'

export default function App() {
  return (
    <SiteThemeProvider>
      <HudShooterProvider>
        <BrowserRouter>
          <CustomCursor />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </HudShooterProvider>
    </SiteThemeProvider>
  )
}
