import { Box, Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
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

  return (
    <Scaffold
      disableBottomPadding
      header={<DefaultHeader header={`درس ` + lesson.order} />}
    >
      <Stack sx={{ height: "100%", gap: 2 }}>
        <Stack sx={{ flex: 1, gap: 2, overflowY: "auto" }}>
          {lesson.conversations.map((conversation) => {
            return (
              <Stack
                key={conversation.id}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "stretch" }}
              >
                <Box sx={{ flex: 1 }}>
                  <ConversationListItem conversation={conversation} lessonId={lesson.id} />
                </Box>
                <LessonTimeline completed={lesson.userLesson.isConversationCompleted} isLast={false} />
              </Stack>
            );
          })}

          {lesson.grammars.map((grammar) => {
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
                <LessonTimeline completed={lesson.userLesson.isGrammarCompleted} isLast={false} />
              </Stack>
            );
          })}

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "stretch" }}>
            <Box sx={{ flex: 1 }}>
              <VocabListItem lessonId={lesson.id} vocabs={lesson.vocabs} />
            </Box>
            <LessonTimeline completed={lesson.userLesson.isVocabCompleted} isLast={false} />
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "stretch" }}>
            <Box sx={{ flex: 1 }}>
              <TestListItem lessonId={lesson.id} tests={lesson.tests} />
            </Box>
            <LessonTimeline completed={lesson.userLesson.isTestCompleted} isLast={true} />
          </Stack>
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
