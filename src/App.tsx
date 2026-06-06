import { BrowserRouter, Route, Routes } from 'react-router-dom';
import setupOpenApi from './api/setup';
import StoryDetailPage from './features/stories/StoryDetailPage';
import LessonPage from './features/lessons/LessonPage';

setupOpenApi();

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="content-area" style={{ padding: '20px' }}>
          <Routes>
            <Route path="/story/:id" element={<StoryDetailPage />} />
            <Route path="/lessons/:id" element={<LessonPage />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
