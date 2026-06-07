import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { GalleryView } from './components/GalleryView'
import { HomePage } from './components/HomePage'
import './styles/global.scss'
import { ScrollToTop } from '@/components/ScrollToTop.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/film/:cameraId/:filmId" element={<GalleryView />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
