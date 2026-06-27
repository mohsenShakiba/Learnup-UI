import { Stack } from '@mui/material';
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

  return (
    <Scaffold
      header={
        <DefaultHeader header='درس اول' subtitle='12 درس' />
      }
    >
      <Stack spacing={2}>


        <Stack spacing={2}>
          {lesson.stories.map((story) => (
            <StoryListItem key={story.id} story={story} />
          ))}
        </Stack>


        <Stack spacing={2}>
          {lesson.grammars.map((grammar) => (
            <GrammarListItem key={grammar.id} grammar={grammar} />
          ))}
        </Stack>


        <VocabListItem lessonId={lesson.id} vocabs={lesson.vocabs} />

      </Stack>

    </Scaffold>
  );
}
