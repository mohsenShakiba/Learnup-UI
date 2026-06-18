import { Box, Stack } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import setupOpenApi from "./api/setup";
import "./App.css";
import CourseDetailPage from "./features/courses/CourseDetailPage";
import ListCoursesPage from "./features/courses/ListCoursesPage";
import GrammarDetailPage from "./features/grammar/pages/GrammarDetailPage";
import ListGrammarPage from "./features/grammar/pages/ListGrammarPage";
import LessonGrammarTestsPage from "./features/GrammarTests/LessonGrammarTestsPage";
import BoxLevelReviewPage from "./features/leitnerBox/BoxLevelReviewPage";
import LeitnerBoxPage from "./features/leitnerBox/LeitnerBoxPage";
import LessonDetailPage from "./features/lessons/LessonDetailPage";
import SettingsPage from "./features/settings/SettingsPage";
import StoryDetailPage from "./features/stories/StoryDetailPage";
import LessonVocabsPage from "./features/vocabs/LessonVocabsPage";
import VocabSearchPage from "./features/vocabs/VocabSearchPage";
import LessonVocabTestsPage from "./features/VocabTests/LessonVocabTestsPage";
import { BottomNav } from "./shared/components/BottomNav";
import { PageFade } from "./shared/components/PageFade";
setupOpenApi();

function App() {
  return (
    <BrowserRouter>
      <Stack sx={{ height: "100dvh", overflow: "hidden" }}>
        <Box sx={{ flex: 1, overflowY: "auto", position: "relative" }}>
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
                <Route
                  path="/lessons/:id/vocabs"
                  element={<LessonVocabsPage />}
                />
                <Route
                  path="/lessons/:id/vocab-tests"
                  element={<LessonVocabTestsPage />}
                />
                <Route
                  path="/lessons/:id/grammar-tests"
                  element={<LessonGrammarTestsPage />}
                />
                <Route path="/vocab" element={<VocabSearchPage />} />
                <Route path="/leitner-box" element={<LeitnerBoxPage />} />
                <Route
                  path="/boxlevel/:level"
                  element={<BoxLevelReviewPage />}
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<ListCoursesPage />} />
                <Route path="*" element={<h1>404 - Not Found</h1>} />
              </Routes>
            )}
          </PageFade>
        </Box>

        <BottomNav />
      </Stack>
    </BrowserRouter>
  );
}

export default App;
