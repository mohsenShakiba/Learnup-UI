import type { SxProps, Theme } from "@mui/material";
import { Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CourseResponse } from "../../../api/Learnup";
import { AppIcon } from "../../../shared/components/AppIcon";
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
      boxSizing: 'border-box',
    }}>

      <Box
        sx={
          {
            position: 'relative',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
            p: 2
          }
        }
      >
        <DotGrid />

        <Stack direction="row" sx={{
          gap: 2,
          position: 'relative',
          alignItems: 'end', justifyContent: 'flex-end', direction: 'rtl', borderBottom: '15px solid', borderColor: 'divider'
        }}>
          <Typography sx={{
            fontSize: 175,
            textAlign: 'LEFT',
            color: '#363a45',
            fontFamily: 'SpaceMono',
            height: '150px',
            width: '85px',
            lineHeight: '140px',
          }}>{course.code[0]}</Typography>
          <Typography sx={{
            fontSize: 175,
            textAlign: 'LEFT',
            color: '#686b75',
            fontFamily: 'SpaceMono',
            height: '150px',
            width: '8px',
            lineHeight: '140px',
          }}>{course.code[1]}</Typography>
          <Box sx={{ flex: 1 }} />

          <Stack sx={{ alignItems: 'flex-start', }}>
            <Typography sx={{
              fontSize: 25,
              textAlign: 'LEFT',
              color: 'primary.main',
              lineHeight: '30px',
              fontFamily: 'SpaceMono',
            }}>Starter</Typography>
            <Typography sx={{
              fontSize: 25,
              textAlign: 'LEFT',
              color: '#999',
              lineHeight: '30px',
              fontFamily: 'SpaceMono',
            }}>English</Typography>
            <Typography sx={{
              pb: 1,
              fontSize: 25,
              textAlign: 'LEFT',
              color: '#999',
              lineHeight: '30px',
              fontFamily: 'SpaceMono',
            }}>Course</Typography>
          </Stack>
        </Stack>

        <Stack direction="column" sx={{ gap: 2 }}>

          <Typography variant="h2"          >
            {course.title}
          </Typography>


          <Typography
            sx={{
              color: "text.secondary",
              whiteSpace: "pre-line",
            }}
          >
            {course.description}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              whiteSpace: "pre-line",
            }}
          >
            {course.coverId}
          </Typography>

          <Stack direction='column' sx={{}}>
            <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}> این دوره شامل</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#001457' }}>{course.totalLessonsCount} تا داستان</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#001457' }}>15 تا گرامر مهم</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#001457' }}>1000 تا کلمه</Typography>
            <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>میشود</Typography>
          </Stack>
        </Stack>



        <Stack spacing={3}>
          <Stack spacing={1} sx={{ width: "100%" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontFamily: "SpaceMono", color: "text.secondary", }}>
                10%
              </Typography>

              <Typography variant="caption" sx={{ fontFamily: "SpaceMono", color: "text.secondary", direction: "rtl", textAlign: "right" }}>
                {course.completedLessonsCount} of {course.totalLessonsCount} lessons
              </Typography>
            </Stack>
            <LinearProgress
              color="info"
              variant="determinate"
              value={progress}
              sx={{ borderRadius: 1 }}
            />
          </Stack>

          <FancyButton
            size="large"
            endIcon={
              <AppIcon>arrow_backward</AppIcon>
            }
            fullWidth
            onClick={handleNavigateToCourseDetail}
            variant='contained' >
            {course.completedLessonsCount > 0 ? 'ادامه بده' : 'بریم شروع کنیم'}
          </FancyButton>
        </Stack>
      </Box>
    </Box>
  );
}
