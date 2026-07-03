import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CoursesService, LessonsService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { LessonListItem } from "./components/LessonListItem";

export default function CourseDetailPage () {
  const { id: courseId } = useParams<{ id: string; }>();
  const courseIdNumber = Number(courseId);

  const courseQuery = useQuery({
    queryKey: ["course", courseIdNumber],
    queryFn: () => CoursesService.getCourseById(courseIdNumber),
  });

  const lessonsQuery = useQuery({
    queryKey: ["lessons", "course", courseIdNumber],
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
  const course = courseQuery.data;

  return (
    <Scaffold
      header={
        <DefaultHeader header={`درس های ${course?.code}`}
        />
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
