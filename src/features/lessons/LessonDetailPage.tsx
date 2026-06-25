import { Box, Icon, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { LessonsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { GrammarListItem } from './components/GrammarListItem';
import { StoryListItem } from './components/StoryListItem';
import { VocabListItem } from './components/VocabListItem';

const CIRCLE_SIZE = 28;
const ITEM_GAP = 16;

function TimelineColumn({ completed, isLast }: { completed: boolean; isLast: boolean }) {
  const color = completed ? 'success.main' : 'warning.main';
  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: CIRCLE_SIZE,
      flexShrink: 0,
    }}>
      <Box sx={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: '50%',
        bgcolor: completed ? color : 'transparent',
        border: '2px solid',
        borderColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        {completed
          ? <Icon sx={{ fontSize: 16, color: 'white' }}>check</Icon>
          : <Icon sx={{ fontSize: 16, color: 'warning.main' }}>hourglass</Icon>
        }
      </Box>
      {!isLast && (
        <Box sx={{
          position: 'absolute',
          top: CIRCLE_SIZE,
          bottom: -ITEM_GAP,
          width: 2,
          bgcolor: color,
        }} />
      )}
    </Box>
  );
}

export default function LessonDetailPage () {
  const { id: lessonId } = useParams<{ id: string; }>();
  const lessonIdNumber = Number(lessonId);

  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonIdNumber],
    queryFn: () => LessonsService.getLessonById(lessonIdNumber),
    enabled: Number.isFinite(lessonIdNumber),
  });

  if (lessonQuery.isLoading) {
    return <AppLoader />;
  }

  if (lessonQuery.isError || !lessonQuery.data) {
    return <ErrorPage onAction={() => void lessonQuery.refetch()} />;
  }

  const lesson = lessonQuery.data;
  const hasVocabs = lesson.vocabs.length > 0;
  const totalItems = lesson.stories.length + lesson.grammars.length + (hasVocabs ? 1 : 0);
  let itemIndex = 0;

  return (
    <Scaffold
      header={
        <DefaultHeader header='درس اول' subtitle='12 درس' />
      }
    >
      <Stack spacing={2}>

        {lesson.stories.map((story) => {
          const isLast = itemIndex === totalItems - 1;
          itemIndex++;
          return (
            <Stack key={story.id} direction="row" spacing={1.5} sx={{ alignItems: 'stretch' }}>
              <Box sx={{ flex: 1 }}>
                <StoryListItem story={story} />
              </Box>
              <TimelineColumn completed={story.isCompleted} isLast={isLast} />
            </Stack>
          );
        })}

        {lesson.grammars.map((grammar) => {
          const isLast = itemIndex === totalItems - 1;
          itemIndex++;
          return (
            <Stack key={grammar.id} direction="row" spacing={1.5} sx={{ alignItems: 'stretch' }}>
              <Box sx={{ flex: 1 }}>
                <GrammarListItem grammar={grammar} />
              </Box>
              <TimelineColumn completed={false} isLast={isLast} />
            </Stack>
          );
        })}

        {hasVocabs && (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'stretch' }}>
            <Box sx={{ flex: 1 }}>
              <VocabListItem lessonId={lesson.id} vocabs={lesson.vocabs} />
            </Box>
            <TimelineColumn completed={false} isLast={true} />
          </Stack>
        )}

      </Stack>
    </Scaffold>
  );
}
