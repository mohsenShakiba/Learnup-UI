import { BrowserRouter, Route, Routes } from 'react-router-dom';
import setupOpenApi from './api/setup';
import './App.css';
import CourseDetailPage from './features/courses/CourseDetailPage';
import ListCoursesPage from './features/courses/ListCoursesPage';
import LessonDetailPage from './features/lessons/LessonDetailPage';
import StoryDetailPage from './features/stories/StoryDetailPage';
setupOpenApi();

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/stories/:id" element={<StoryDetailPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/languages/:languageId/courses" element={<ListCoursesPage />} />
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/" element={<ListCoursesPage />} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
