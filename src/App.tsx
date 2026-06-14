import { Box, Stack } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import setupOpenApi from "./api/setup";
import "./App.css";
import CourseDetailPage from "./features/courses/CourseDetailPage";
import ListCoursesPage from "./features/courses/ListCoursesPage";
import GrammarDetailPage from "./features/grammar/pages/GrammarDetailPage";
import ListGrammarPage from "./features/grammar/pages/ListGrammarPage";
import LessonDetailPage from "./features/lessons/LessonDetailPage";
import StoryDetailPage from "./features/stories/StoryDetailPage";
import SettingsPage from "./features/settings/SettingsPage";
import LessonVocabsPage from "./features/vocabs/LessonVocabsPage";
import { BottomNav } from "./shared/components/BottomNav";
import { PageFade } from "./shared/components/PageFade";
setupOpenApi();

function App () {
  return (
    <BrowserRouter>
      <Stack sx={{ height: '100dvh', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <PageFade>
            {(location) => (
              <Routes location={location}>
                <Route path="/stories/:id" element={<StoryDetailPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/grammar" element={<ListGrammarPage />} />
                <Route path="/grammars/:id" element={<GrammarDetailPage />} />
                <Route
                  path="/languages/:languageId/courses"
                  element={<ListCoursesPage />}
                />
                <Route path="/lessons/:id" element={<LessonDetailPage />} />
                <Route path="/lessons/:id/vocabs" element={<LessonVocabsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<ListCoursesPage />} />
                <Route path="*" element={<h1>404 - Not Found</h1>} />
              </Routes>
            )}
          </PageFade>
        </Box>

        <BottomNav />
      </Stack>

    </BrowserRouter >
  );
}

export default App;
