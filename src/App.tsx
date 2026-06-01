import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { GalleryView } from './components/GalleryView'
import { HomePage } from './components/HomePage'
import { useTheme } from './hooks/useTheme'
import './styles/global.scss'
import { ScrollToTop } from '@/components/ScrollToTop.tsx'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/film/:filmId" element={<GalleryView />} />
        {/* Fallback — redirect unknown paths to home */}
        <Route path="*" element={<HomePage theme={theme} onToggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}
