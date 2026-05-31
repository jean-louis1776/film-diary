import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { GalleryView } from './components/GalleryView';
import './styles/global.scss';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/film/:filmId" element={<GalleryView />} />
        {/* Fallback — redirect unknown paths to home */}
        <Route path="*"            element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
