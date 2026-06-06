import { CircularProgress, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { CoursesService, LessonsService } from '../../api/Learnup';
import { EmptyList } from '../../shared/components/EmptyList';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
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
    return <CircularProgress />;
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

  const course = courseQuery.data;
  const lessons = lessonsQuery.data ?? [];

  return (
    <Scaffold title={course?.title}>

      <Stack>
        {lessons.length === 0 ? (
          <EmptyList />
        ) : (
          <Stack spacing={2}>
            {lessons.map((lesson) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Scaffold>
  );
}
