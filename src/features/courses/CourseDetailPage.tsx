import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { CoursesService, LessonsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { WaveProgress } from '../../shared/components/WaveProgress';
import { LessonListItem } from './components/LessonListItem';

export default function CourseDetailPage () {

  const { id: courseId } = useParams<{ id: string; }>();
  const courseIdNumber = Number(courseId);

  const courseQuery = useQuery({
    queryKey: ['course', courseIdNumber],
    queryFn: () => CoursesService.getCourseById(courseIdNumber),
  });

  const lessonsQuery = useQuery({
    queryKey: ['lessons', 'course', courseIdNumber],
    queryFn: () => LessonsService.getLessonsByCourseId(courseIdNumber),
  });

  if (courseQuery.isLoading || lessonsQuery.isLoading) {
    return <AppLoader />;
  }

  if (courseQuery.isError || lessonsQuery.isError) {
    return (
      <ErrorPage
        onAction={() => {
          void courseQuery.refetch();
          void lessonsQuery.refetch();
        }}
      />
    );
  }

  const lessons = lessonsQuery.data ?? [];

  return (
    <Scaffold maxWidth='sm'
      header={
        <DefaultHeader header='لیست دروس'
          subtitle='12 درس'
          children={
            <WaveProgress value={40} size={40} />
          } />
      }>
      <Stack>
        <Stack spacing={2}>
          {lessons.map((lesson, index) => (
            <LessonListItem
              key={lesson.id}
              lesson={lesson}
              isLast={index === lessons.length - 1}
            />
          ))}
        </Stack>
      </Stack>
    </Scaffold>
  );
}
