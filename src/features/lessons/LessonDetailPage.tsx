import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { LessonsService } from '../../api/Learnup';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { StoryListItem } from './components/StoryListItem';

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
  const storyIds = lesson.storyIds ?? [];
  const grammarIds = lesson.grammarIds ?? [];

  return (
    <Scaffold
      header={
        <Box>
          <Typography variant="h6">{lesson.title}</Typography>
        </Box>
      }
    >
      <Stack spacing={2}>


        <Typography>داستان ها</Typography>

        <Divider />

        <Stack spacing={1.5}>
          {storyIds.map((id) => (
            <StoryListItem key={id} storyId={id} />
          ))}
        </Stack>


        <Typography>گرامر ها</Typography>

        <Divider />

        <Stack spacing={1}>
          {grammarIds.map((id) => (
            <Typography key={id} variant="body2" color="text.secondary">
              Grammar #{id}
            </Typography>
          ))}
        </Stack>

        <Typography>گرامر ها</Typography>

        <Divider />

        <Stack spacing={1}>

        </Stack>

      </Stack>
    </Scaffold>
  );
}
