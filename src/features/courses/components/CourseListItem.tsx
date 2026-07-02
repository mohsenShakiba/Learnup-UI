import type { SxProps, Theme } from "@mui/material";
import { Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CourseResponse } from "../../../api/Learnup";
import type { IconName } from "../../../shared/components/AppIcon";
import { AppIcon } from "../../../shared/components/AppIcon";
import { DotGrid } from "../../../shared/components/DotGrid";
import { FancyButton } from "../../../shared/components/FancyButton";
import { DurationBadge } from "../../../shared/components/DurationBadge";

type CourseListItemProps = {
  course: CourseResponse;
  sx?: SxProps<Theme>;
};

const courseLevelLabels: Record<string, string> = {
  A1: "سطح مبتدی",
  A2: "سطح مبتدی",
  B1: "سطح متوسط",
  B2: "سطح متوسط",
  C1: "سطح پیشرفته",
  C2: "سطح پیشرفته",
};

const defaultCourseLevelLabel = "سطح مبتدی";

type CourseStat = {
  icon: string;
  value: number;
  label: string;
  hint: string;
};

export function CourseListItem({ course }: CourseListItemProps) {

  const navigate = useNavigate();
  const theme = useTheme();

  const progress = course.totalLessonsCount > 0
    ? (course.completedLessonsCount / course.totalLessonsCount) * 100
    : 0;

  const handleNavigateToCourseDetail = () => {
    navigate(`/courses/${course.id}`);
  };

  const levelLabel = courseLevelLabels[course.code.toUpperCase()] ?? defaultCourseLevelLabel;

  const stats: CourseStat[] = [
    { icon: "translate", value: course.totalLessonsCount, label: "کلمه", hint: "واژگان کلیدی" },
    { icon: "book_ribbon", value: course.totalLessonsCount, label: "گرامر", hint: "ساختارهای کاربردی" },
    { icon: "conversation", value: course.totalLessonsCount, label: "مکالمه", hint: "داستان‌های جذاب" },
  ];

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
        <Box />
        <Box sx={{ position: 'absolute', top: 16, right: 16, width: 80, height: 80, zIndex: 0 }}>
          <DotGrid zIndex={1} />
        </Box>
        {/* Header: big course code + level chip and English title */}
        <Stack direction="row" sx={{
          gap: 2,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
        }}>
          {/* Decorative blobs behind the course code */}
          <Box aria-hidden sx={{
            position: 'absolute',
            right: 5,
            top: -10,
            width: 140,
            height: 140,
            bgcolor: 'primary.main',
            opacity: 0.07,
            zIndex: 0,
            borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
            animation: 'courseBlobA 22s ease-in-out infinite',
            '@keyframes courseBlobA': {
              '0%, 100%': {
                borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
                transform: 'rotate(0deg) scale(1)',
              },
              '20%': {
                borderRadius: '67% 33% 41% 59% / 58% 41% 59% 42%',
                transform: 'rotate(6deg) scale(1.04)',
              },
              '40%': {
                borderRadius: '38% 62% 71% 29% / 63% 34% 66% 37%',
                transform: 'rotate(14deg) scale(1.07)',
              },
              '60%': {
                borderRadius: '59% 41% 32% 68% / 44% 62% 38% 56%',
                transform: 'rotate(9deg) scale(1.02)',
              },
              '80%': {
                borderRadius: '48% 52% 57% 43% / 36% 55% 45% 64%',
                transform: 'rotate(-5deg) scale(1.05)',
              },
            },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }} />
          <Box aria-hidden sx={{
            position: 'absolute',
            right: 90,
            bottom: 10,
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            opacity: 0.05,
            zIndex: 0,
            borderRadius: '63% 37% 44% 56% / 49% 55% 45% 51%',
            animation: 'courseBlobB 18s ease-in-out infinite',
            '@keyframes courseBlobB': {
              '0%, 100%': {
                borderRadius: '63% 37% 44% 56% / 49% 55% 45% 51%',
                transform: 'translateY(0) rotate(0deg) scale(1)',
              },
              '25%': {
                borderRadius: '34% 66% 61% 39% / 62% 38% 63% 37%',
                transform: 'translateY(-5px) rotate(-9deg) scale(1.06)',
              },
              '50%': {
                borderRadius: '37% 63% 56% 44% / 55% 45% 55% 45%',
                transform: 'translateY(-8px) rotate(-14deg) scale(1.03)',
              },
              '75%': {
                borderRadius: '58% 42% 33% 67% / 41% 58% 43% 60%',
                transform: 'translateY(-3px) rotate(-4deg) scale(1.05)',
              },
            },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }} />

          <Typography sx={{
            position: 'relative',
            zIndex: 1,
            fontSize: 130,
            color: theme.palette.mode === 'dark' ? '#e8ebf2' : '#122444',
            fontFamily: 'Roboto',
            lineHeight: '100px',
            width: 60,
          }}>{course.code[0]}</Typography>

          <Typography sx={{
            position: 'relative',
            zIndex: 1,
            fontSize: 130,
            color: 'primary.main',
            fontFamily: 'Roboto',
            lineHeight: '100px',
          }}>{course.code[1]}</Typography>

          <Stack sx={{ alignItems: 'flex-start', gap: 1, position: 'relative', zIndex: 1 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1,
              py: 0.5,
              borderRadius: '4px',
              bgcolor: 'rgba(0,94,255,0.1)',
            }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'primary.main' }}>{levelLabel}</Typography>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
            </Box>
            <Stack sx={{ alignItems: 'flex-start' }}>
              <Typography sx={{
                fontSize: 25,
                color: theme.palette.mode === 'dark' ? '#e8ebf2' : '#122444',
                lineHeight: '30px',
                fontFamily: 'Roboto',
              }}>English</Typography>
              <Typography sx={{
                fontSize: 25,
                color: theme.palette.mode === 'dark' ? '#e8ebf2' : '#122444',
                lineHeight: '30px',
                fontFamily: 'Roboto',
              }}>Course</Typography>
            </Stack>

            <Box sx={{ width: 60, height: '3px', borderRadius: 2, bgcolor: 'primary.main' }} />
          </Stack>
        </Stack>

        {/* Section heading + description */}
        <Stack direction="column" sx={{ gap: 1.5, position: 'relative' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <AppIcon sx={{ color: 'primary.main' }}>rocket_launch</AppIcon>
            <Typography variant="h6">شروع مسیر</Typography>

            <Box sx={{ flex: 1 }} />
            <DurationBadge minutes={"15"} unit="hour" />
          </Stack>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {course.description}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {course.coverId}
          </Typography>

        </Stack>

        {/* Stats */}
        <Stack direction="row" sx={{ gap: 1, position: 'relative' }}>
          {stats.map((stat) => (
            <Stack
              key={stat.label}
              sx={{
                flex: 1,
                alignItems: 'center',
                textAlign: 'center',
                gap: 0.75,
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{
                width: 42,
                height: 42,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(0,94,255,0.15)' : 'rgba(0,94,255,0.08)',
              }}>
                <AppIcon sx={{ color: 'primary.main' }}>{stat.icon}</AppIcon>
              </Box>
              <Typography variant="caption" sx={{
                color: 'text.secondary',
              }}>
                {stat.value}  {stat.label}
              </Typography>

            </Stack>
          ))}
        </Stack>

        <Stack spacing={2} sx={{ position: 'relative' }}>
          <Box sx={{
          }}>
            <Stack spacing={1} sx={{ width: "100%" }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ fontFamily: "SpaceMono", color: "text.secondary" }}>
                  {Math.round(progress)}%
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
          </Box>

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
