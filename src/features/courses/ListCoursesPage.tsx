import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { CoursesService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { CourseListItem } from "./components/CourseListItem";
import { CoursePagination } from "./components/CoursePagination";

export default function ListCoursesPage () {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const coursesQuery = useQuery({
    queryKey: ["courses", "language"],
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
    <Scaffold disablePadding header={<DefaultHeader header="لیست دوره ها" />}>
      <Box
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box
          sx={{ position: "relative", flex: 1, width: "100%", display: "flex" }}
        >
          <Swiper
            direction="horizontal"
            slidesPerView={1}
            style={{ flex: 1, width: "100%" }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {courses.map((course) => (
              <SwiperSlide key={course.id}>
                <CourseListItem course={course} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <CoursePagination
          count={courses.length}
          activeIndex={activeIndex}
          onDotClick={(index) => swiperRef.current?.slideTo(index)}
        />
      </Box>
    </Scaffold>
  );
}
