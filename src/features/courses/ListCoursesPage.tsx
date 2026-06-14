import { useQuery } from '@tanstack/react-query';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CoursesService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { CourseListItem } from './components/CourseListItem';

export default function ListCoursesPage () {
  const coursesQuery = useQuery({
    queryKey: ['courses', 'language'],
    queryFn: () => CoursesService.getCoursesByLanguageId(1),
  });

  if (coursesQuery.isLoading) {
    return <AppLoader />;
  }

  if (coursesQuery.isError) {
    return <ErrorPage onAction={() => void coursesQuery.refetch()} />;
  }

  const courses = coursesQuery.data ?? [];

  return (
    <Swiper
      direction='horizontal'
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1}
    >
      {courses.map((course) => (
        <SwiperSlide key={course.id} >
          <CourseListItem key={course.id} course={course} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
