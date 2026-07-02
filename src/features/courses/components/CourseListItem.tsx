import type { SxProps, Theme } from "@mui/material";
import { Box, LinearProgress, Paper, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CourseResponse } from "../../../api/Learnup";
import { DotGrid } from "../../../shared/components/DotGrid";
import { FancyButton } from "../../../shared/components/FancyButton";

type CourseListItemProps = {
  course: CourseResponse;
  sx?: SxProps<Theme>;
};

const courseCodeColors: Record<string, string> = {
  A1: "#269e5a",
  A2: "#269e82",
  B1: "#268a9e",
  B2: "#26669e",
  C1: "#263e9e",
};

const defaultCourseCodeColor = "#d683b9";

export function CourseListItem ({ course }: CourseListItemProps) {

  const navigate = useNavigate();
  const theme = useTheme();

  const progress = course.totalLessonsCount > 0
    ? (course.completedLessonsCount / course.totalLessonsCount) * 100
    : 0;

  const handleNavigateToCourseDetail = () => {
    navigate(`/courses/${course.id}`);
  };

  const imageUrl = theme.palette.mode === 'dark' ? `url(/images/courses/v2/${course.code.toLowerCase()}_dark.png)` : `url(/images/courses/v2/${course.code.toLowerCase()}.png)`;
  const courseCodeColor = courseCodeColors[course.code.toUpperCase()] ?? defaultCourseCodeColor;

  return (
    <Box sx={{
      p: 2,
      pb: 0,
      display: 'flex',
      height: '100%',
      boxSizing: 'border-box'
    }}>

      <Paper
        sx={
          {
            borderRadius: 2,
            flex: 1,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }
        }
      >
        <Box
          sx={{
            flex: 1,
            position: 'relative',

          }}
        >
          <Box sx={{
            backgroundImage: imageUrl,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            zIndex: 2,
            position: 'absolute',
          }}>

          </Box>
          <DotGrid gap={15} zIndex={1} />
        </Box>

        <Stack
          sx={{
            p: 2,
            gap: 2,
          }}
        >
          <Stack spacing={1}>


            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  background: courseCodeColor,
                  color: "black",
                  px: 0.8,
                  py: 0.4,
                  borderRadius: 1,
                }}
              >
                <Typography>
                  {course.code}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "text.primary",
                }}
              >
                {course.title}
              </Typography>

            </Stack>
            {/* <TextCarousel items={
              [
                <Stack direction='row' sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>{course.totalLessonsCount} تا داستان</Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>میخونی</Typography>
                </Stack>,
                <Stack direction='row' sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>{course.totalLessonsCount} تا گرامر مهم</Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>یاد میگیری</Typography>
                </Stack>,
                <Stack direction='row' sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>{course.totalLessonsCount} تا کلمه</Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>یاد میگیری</Typography>
                </Stack>,
              ]}
            /> */}

            <Stack direction='row' sx={{ gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>{course.totalLessonsCount} تا داستان</Typography>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>میخونی</Typography>
            </Stack>
            <Stack direction='row' sx={{ gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>{course.totalLessonsCount} تا گرامر مهم</Typography>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>یاد میگیری</Typography>
            </Stack>
            <Stack direction='row' sx={{ gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>{course.totalLessonsCount} تا کلمه</Typography>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>یاد میگیری</Typography>
            </Stack>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {course.description}
            </Typography>
          </Stack>

          <Stack spacing={1} sx={{ width: "100%" }}>
            <LinearProgress
              color="info"
              variant="determinate"
              value={progress}
              sx={{ borderRadius: 1 }}
            />
            {/* <DottedProgress value={progress} /> */}
            <Stack
              direction="row"
              sx={{ color: "text.secondary", fontSize: "0.8rem", gap: 1 }}
            >
              <Typography sx={{ fontSize: "inherit", color: "secondary.main" }}>
                {course.completedLessonsCount}
              </Typography>
              <Typography sx={{ fontSize: "inherit" }}>درس از مجموع</Typography>
              <Typography sx={{ fontSize: "inherit", color: "secondary.main" }}>
                {course.totalLessonsCount}
              </Typography>
              <Typography sx={{ fontSize: "inherit" }}>درس</Typography>
            </Stack>
          </Stack>

          <FancyButton
            fullWidth
            onClick={handleNavigateToCourseDetail}
            variant='contained' >
            {course.completedLessonsCount > 0 ? 'ادامه بده' : 'بریم شروع کنیم'}
          </FancyButton>
        </Stack>
      </Paper>
    </Box>
  );
}
