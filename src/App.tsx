import { Box, Stack } from "@mui/material";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import setupOpenApi from "./api/setup";
import "./App.css";
import LoginPage from "./features/auth/LoginPage";
import { RequireAuth } from "./features/auth/RequireAuth";
import CourseDetailPage from "./features/courses/CourseDetailPage";
import ListCoursesPage from "./features/courses/ListCoursesPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import GrammarDetailPage from "./features/grammar/pages/GrammarDetailPage";
import ListGrammarPage from "./features/grammar/pages/ListGrammarPage";
import LessonGrammarTestsPage from "./features/GrammarTests/LessonGrammarTestsPage";
import BoxLevelReviewPage from "./features/leitnerBox/BoxLevelReviewPage";
import LeitnerBoxPage from "./features/leitnerBox/LeitnerBoxPage";
import LessonDetailPage from "./features/lessons/LessonDetailPage";
import BookDetailPage from "./features/library/BookDetailPage";
import ListBooksPage from "./features/library/ListBooksPage";
import UploadBookPage from "./features/library/UploadBookPage";
import ProfilePage from "./features/profile/ProfilePage";
import SubscriptionsPage from "./features/settings/SubscriptionsPage";
import StoryDetailPage from "./features/stories/StoryDetailPage";
import LessonVocabsPage from "./features/vocabs/LessonVocabsPage";
import VocabSearchPage from "./features/vocabs/VocabSearchPage";
import LessonVocabTestsPage from "./features/VocabTests/LessonVocabTestsPage";
import { BottomNav, isBottomNavVisible } from "./shared/components/BottomNav";
setupOpenApi();

function AppLayout () {
  const location = useLocation();
  const hasBottomNav = isBottomNavVisible(location.pathname);

  return (
    <Stack sx={{ height: "100dvh", overflow: "hidden", position: "relative" }}>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          pb: hasBottomNav ? "calc(env(safe-area-inset-bottom, 0px))" : 0,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/lessons/:lessonId/stories/:id" element={<StoryDetailPage />} />
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
              path="/boxlevel/:id"
              element={<BoxLevelReviewPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/library/book/:bookId" element={<BookDetailPage />} />
            <Route path="/library" element={<ListBooksPage />} />
            <Route
              path="/library/user-books/upload"
              element={<UploadBookPage />}
            />
            <Route path="/" element={<ListCoursesPage />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Route>
        </Routes>
      </Box>

      <BottomNav />
    </Stack>
  );
}

function App () {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
