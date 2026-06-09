import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { LessonsService } from '../../api/Learnup';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { StoryListItem } from './components/StoryListItem';
import { VocabBox } from './components/VocabBox';

export default function LessonDetailPage () {
  const { id: lessonId } = useParams<{ id: string; }>();
  const lessonIdNumber = Number(lessonId);

  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonIdNumber],
    queryFn: () => LessonsService.getLessonById(lessonIdNumber),
    enabled: Number.isFinite(lessonIdNumber),
  });

  if (lessonQuery.isLoading) {
    return <CircularProgress />;
  }

  if (lessonQuery.isError || !lessonQuery.data) {
    return <ErrorPage onAction={() => void lessonQuery.refetch()} />;
  }

  const lesson = lessonQuery.data;

  return (
    <Scaffold
      header={
        <Box>
          <Typography variant="h6">{lesson.title}</Typography>
        </Box>
      }
    >
      <Stack spacing={2}>


        <Stack spacing={1.5}>
          {lesson.stories.map((story) => (
            <StoryListItem key={story.id} story={story} />
          ))}
        </Stack>

        <Stack spacing={1}>
          {lesson.grammars.map((grammar) => (
            <Typography key={grammar.id} variant="body2" color="text.secondary">
              Grammar #{grammar.id}
            </Typography>
          ))}
        </Stack>

        <VocabBox vocabs={lesson.vocabs} />

      </Stack>
    </Scaffold>
  );
}
