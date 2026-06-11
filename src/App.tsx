import { Box, Stack } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import setupOpenApi from "./api/setup";
import "./App.css";
import CourseDetailPage from "./features/courses/CourseDetailPage";
import ListCoursesPage from "./features/courses/ListCoursesPage";
import ListGrammarPage from "./features/grammar/pages/ListGrammarPage";
import LessonDetailPage from "./features/lessons/LessonDetailPage";
import StoryDetailPage from "./features/stories/StoryDetailPage";
import { BottomNav } from "./shared/components/BottomNav";
import { DotGrid } from "./shared/components/DotGrid";
setupOpenApi();

function App () {
  return (
    <BrowserRouter>
      <Stack sx={{ height: '100dvh' }}>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/stories/:id" element={<StoryDetailPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/grammar" element={<ListGrammarPage />} />
            <Route
              path="/languages/:languageId/courses"
              element={<ListCoursesPage />}
            />
            <Route path="/lessons/:id" element={<LessonDetailPage />} />
            <Route path="/" element={<ListCoursesPage />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </Box>
        <DotGrid />

        <BottomNav />
      </Stack>

    </BrowserRouter >
  );
}

export default App;
