import { CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '../../api/Learnup';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { CourseListItem } from './components/CourseListItem';

export default function ListCoursesPage () {


  const coursesQuery = useQuery({
    queryKey: ['courses', 'language'],
    queryFn: () => CoursesService.getCoursesByLanguageId(1),
  });

  if (coursesQuery.isLoading) {
    return <CircularProgress />;
  }

  if (coursesQuery.isError) {
    return <ErrorPage onAction={() => void coursesQuery.refetch()} />;
  }

  const courses = coursesQuery.data ?? [];

  return (
    <Scaffold
      header={
        <Stack>
          <Typography color='primary'>
            لیست دوره ها
          </Typography>
        </Stack>

      } maxWidth='sm' >
      <Stack spacing={2}>
        {courses.map((course) => (
          <CourseListItem
            key={course.id}
            course={course}
          />
        ))}
      </Stack>
    </Scaffold >
  );
}
