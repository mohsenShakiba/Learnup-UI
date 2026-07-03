import { Box, Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { TestType } from "../../api/Learnup";
import { AppIcon } from "../../shared/components/AppIcon";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { ConversationListItem } from "./components/ConversationListItem";
import { GrammarListItem } from "./components/GrammarListItem";
import { LessonTimeline } from "./components/LessonTimeline";
import { TestListItem } from "./components/TestListItem";
import { VocabListItem } from "./components/VocabListItem";
import { useLesson } from "./hooks/useLesson";

export default function LessonDetailPage () {
  const { id: lessonId } = useParams<{ id: string; }>();
  const lessonIdNumber = Number(lessonId);
  const navigate = useNavigate();

  const lessonQuery = useLesson(lessonIdNumber);

  if (lessonQuery.isLoading) {
    return <AppLoader />;
  }

  if (lessonQuery.isError || !lessonQuery.data) {
    return <ErrorPage onAction={() => void lessonQuery.refetch()} />;
  }

  const lesson = lessonQuery.data;
  const hasVocabs = lesson.vocabs.length > 0;
  const hasTests = lesson.tests.length > 0;
  const hasGrammarTests = lesson.tests.some((test) => test.type === TestType.GRAMMAR);
  const hasVocabTests = lesson.tests.some((test) => test.type === TestType.VOCAB);
  const hasIncompleteGrammarTests = lesson.tests.some((test) => test.type === TestType.GRAMMAR && test.isCorrect === null);
  const hasIncompleteVocabTests = lesson.tests.some((test) => test.type === TestType.VOCAB && test.isCorrect === null);
  const testsCompleted =
    (!hasGrammarTests || lesson.userLesson.isGrammarTestCompleted) &&
    (!hasVocabTests || lesson.userLesson.isVocabTestCompleted) &&
    !hasIncompleteGrammarTests &&
    !hasIncompleteVocabTests;
  const totalItems =
    lesson.stories.length +
    lesson.grammars.length +
    (hasVocabs ? 1 : 0) +
    (hasTests ? 1 : 0);
  let itemIndex = 0;

  return (
    <Scaffold
      disableBottomPadding
      header={<DefaultHeader header={`درس ` + lesson.order} />}
    >
      <Stack sx={{ height: "100%", gap: 2 }}>
        <Stack sx={{ flex: 1, gap: 2, overflowY: "auto" }}>
          {lesson.stories.map((story) => {
            const isLast = itemIndex === totalItems - 1;
            itemIndex++;
            return (
              <Stack
                key={story.id}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "stretch" }}
              >
                <Box sx={{ flex: 1 }}>
                  <ConversationListItem story={story} lessonId={lesson.id} />
                </Box>
                <LessonTimeline completed={story.isCompleted} isLast={isLast} />
              </Stack>
            );
          })}

          {lesson.grammars.map((grammar) => {
            const isLast = itemIndex === totalItems - 1;
            itemIndex++;
            return (
              <Stack
                key={grammar.id}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "stretch" }}
              >
                <Box sx={{ flex: 1 }}>
                  <GrammarListItem grammar={grammar} lessonId={lesson.id} />
                </Box>
                <LessonTimeline completed={lesson.userLesson.isGrammarCompleted} isLast={isLast} />
              </Stack>
            );
          })}

          {hasVocabs && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "stretch" }}>
              <Box sx={{ flex: 1 }}>
                <VocabListItem lessonId={lesson.id} vocabs={lesson.vocabs} />
              </Box>
              <LessonTimeline completed={lesson.userLesson.isVocabCompleted} isLast={!hasTests} />
            </Stack>
          )}

          {hasTests && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "stretch" }}>
              <Box sx={{ flex: 1 }}>
                <TestListItem lessonId={lesson.id} tests={lesson.tests} />
              </Box>
              <LessonTimeline completed={testsCompleted} isLast={true} />
            </Stack>
          )}
        </Stack>

        {lesson.nextLessonId !== null && (
          <>
            <Stack sx={{ gap: 2, pb: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                endIcon={<AppIcon>arrow_back</AppIcon>}
                onClick={() => navigate(`/lessons/${lesson.nextLessonId}`)}
                sx={{ alignSelf: "center" }}
              >
                برای درس بعدی آماده ای؟
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Scaffold>
  );
}
