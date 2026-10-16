import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HomePage } from '@/pages/HomePage';
import { GeneratePage } from '@/pages/GeneratePage';
import { LessonPage } from '@/pages/LessonPage';
import { LibraryPage } from '@/pages/LibraryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
