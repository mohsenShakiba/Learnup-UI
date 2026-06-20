import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { LessonsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { LessonTimeline } from './components/LessonTimeline';

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
      <LessonTimeline
        stories={lesson.stories}
        grammars={lesson.grammars}
        vocabs={lesson.vocabs}
        vocabTest={lesson.vocabTest}
        lessonId={lesson.id}
      />
    </Scaffold>
  );
}
