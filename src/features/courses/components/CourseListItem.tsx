import type { SxProps, Theme } from '@mui/material';
import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { CourseResponse } from '../../../api/Learnup';
import { TextCarousel } from '../../../components/TextCarousel';
import { FancyButton } from '../../../shared/components/FancyButton';
import { ImageLoader } from '../../../shared/components/ImageLoader';

type CourseListItemProps = {
  course: CourseResponse;
  sx?: SxProps<Theme>;
};

export function CourseListItem ({ course }: CourseListItemProps) {

  const navigate = useNavigate();


  const progress = course.totalLessonsCount > 0
    ? (course.completedLessonsCount / course.totalLessonsCount) * 100
    : 0;

  const handleNavigateToCourseDetail = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <Box sx={{
      p: 2,
      mb: 2.5,
    }}>


      <Paper
        sx={
          {
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100dvh - 110px)',
            p: 0,
            overflow: 'hidden'
          }
        }
      >

        <Box sx={{
          flex: 1, mb: 2
        }}>
          <ImageLoader coverId={course.coverId} />
        </Box>

        <Stack
          sx={{
            p: 2,
            gap: 2,
          }}
        >

          <Stack spacing={1} >
            <Stack direction='row' sx={{ borderRadius: 0.5, overflow: 'hidden', fontSize: '0.9rem' }}>
              <Box sx={{ background: '#d683b9', color: 'black', px: 0.8, py: 0.4, fontFamily: 'arial' }}>
                {course.code}
              </Box>
              <Box sx={{ bgcolor: 'background.default', color: 'text.primary', px: 0.8, py: 0.4 }}>
                {course.slug}
              </Box>
            </Stack>

            <Typography
              sx={{
                fontSize: '1.2rem',
                color: 'text.primary',
              }}
            >
              {course.title}
            </Typography>

            <TextCarousel items={
              [
                <Stack direction='row' sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>30 تا داستان</Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>میخونی</Typography>
                </Stack>,
                <Stack direction='row' sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>20 تا گرامر مهم</Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>یاد میگیری</Typography>
                </Stack>,
                <Stack direction='row' sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>در این دوره</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'orange' }}>300 تا کلمه</Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.4 }}>یاد میگیری</Typography>
                </Stack>,
              ]
            } />

            <Typography
              sx={{
                color: 'text.secondary',
              }}
            >
              {course.description}
            </Typography>
          </Stack>




          <Stack spacing={1} sx={{ width: '100%' }}>
            <LinearProgress variant='determinate' value={progress} sx={{ borderRadius: 1 }} />
            {/* <DottedProgress value={progress} /> */}
            <Stack direction='row' sx={{ color: 'text.secondary', fontSize: '0.8rem', gap: 1 }}>
              <Typography sx={{ fontSize: 'inherit', color: 'primary.main' }}>
                {course.completedLessonsCount}
              </Typography>
              <Typography sx={{ fontSize: 'inherit' }}>
                درس از مجموع
              </Typography>
              <Typography sx={{ fontSize: 'inherit', color: 'primary.main' }}>
                {course.totalLessonsCount}
              </Typography>
              <Typography sx={{ fontSize: 'inherit' }}>
                درس
              </Typography>
            </Stack>

          </Stack>

          <FancyButton
            sx={{ py: 1.5, borderRadius: 99 }}
            fullWidth
            onClick={handleNavigateToCourseDetail}
            variant='contained' >
            بریم شروع کنیم
          </FancyButton>
        </Stack>
      </Paper>
    </Box>
  );
}
