import { BrowserRouter, Route, Routes } from 'react-router-dom';
import setupOpenApi from './api/setup';
import StoryDetailPage from './features/stories/StoryDetailPage';

setupOpenApi();

function App () {
  return (
    <BrowserRouter>
      <div className="App">

        {/* Routes container */}
        <div className="content-area" style={{ padding: '20px' }}>
          <Routes>
            <Route path="/story/:id" element={<StoryDetailPage />} />
            {/* Add a 404 route for unmatched paths */}
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}


export default App;

