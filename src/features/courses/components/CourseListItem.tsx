import type { SxProps, Theme } from "@mui/material";
import { Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CourseResponse } from "../../../api/Learnup";
import type { IconName } from "../../../shared/components/AppIcon";
import { AppIcon } from "../../../shared/components/AppIcon";
import { DotGrid } from "../../../shared/components/DotGrid";
import { FancyButton } from "../../../shared/components/FancyButton";

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
  icon: IconName;
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
    { icon: "menu_book", value: course.totalLessonsCount, label: "تا کلمه", hint: "واژگان کلیدی" },
    { icon: "chat_bubble", value: course.totalLessonsCount, label: "تا گرامر مهم", hint: "ساختارهای کاربردی" },
    { icon: "schedule", value: course.totalLessonsCount, label: "تا داستان", hint: "داستان‌های جذاب" },
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
        {/* Header: big course code + level chip and English title */}
        <Stack direction="row" sx={{
          gap: 2,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
        }}>
          {/* Decorative circles behind the course code */}
          <Box aria-hidden sx={{
            position: 'absolute',
            right: -10,
            top: -10,
            width: 140,
            height: 140,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.06,
            zIndex: 0,
          }} />
          <Box aria-hidden sx={{
            position: 'absolute',
            right: 90,
            bottom: 10,
            width: 70,
            height: 70,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.05,
            zIndex: 0,
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
              px: 1,
              py: 0.25,
              borderRadius: '4px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              opacity: 0.9,
            }}>
              <Typography sx={{ fontSize: '0.75rem' }}>{levelLabel}</Typography>
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
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              20 ساعت
            </Typography>
          </Stack>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {course.description}
          </Typography>

        </Stack>

        {/* Stats */}
        <Stack direction="row" sx={{ gap: 1.5, position: 'relative' }}>
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
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(0,94,255,0.15)' : 'rgba(0,94,255,0.08)',
              }}>
                <AppIcon sx={{ color: 'primary.main' }}>{stat.icon}</AppIcon>
              </Box>
              <Typography sx={{
                fontFamily: 'SpaceMono',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#e8ebf2' : '#122444',
              }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: theme.palette.mode === 'dark' ? '#e8ebf2' : '#122444' }}>
                {stat.label}
              </Typography>

            </Stack>
          ))}
        </Stack>

        <Stack spacing={2} sx={{ position: 'relative' }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <Stack spacing={1} sx={{ width: "100%" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", direction: "rtl", textAlign: "right" }}>
                پیشرفت شما
              </Typography>
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
