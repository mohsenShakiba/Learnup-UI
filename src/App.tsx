import { BrowserRouter, Route, Routes } from 'react-router-dom';
import setupOpenApi from './api/setup';
import CourseDetailPage from './features/courses/CourseDetailPage';
import StoryDetailPage from './features/stories/StoryDetailPage';

setupOpenApi();

function App () {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="content-area" style={{ padding: '20px' }}>
          <Routes>
            <Route path="/story/:id" element={<StoryDetailPage />} />
            <Route path="/lessons/:id" element={<CourseDetailPage />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
