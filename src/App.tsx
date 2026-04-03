import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CustomCursor } from './components/CustomCursor'
import { HudShooterProvider } from './contexts/HudShooterContext'
import { RootLayout } from './layouts/RootLayout'
import Home from './pages/Home'

export default function App() {
  return (
    <HudShooterProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HudShooterProvider>
  )
}
