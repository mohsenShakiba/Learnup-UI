import type { SxProps, Theme } from '@mui/material';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { CourseResponse } from '../../../api/Learnup';
import { TextCarousel } from '../../../components/TextCarousel';
import { DottedProgress } from '../../../shared/components/DottedProgress';
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
      height: '100%',
      p: 3,
      pb: 5,
      display: 'flex',
      boxSizing: 'border-box',
      flexDirection: 'column',

    }}>


      <Paper
        sx={
          {
            position: 'relative',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }
      >


        <Box sx={{
          borderRadius: 1, flex: 1, overflow: 'hidden', mb: 2
        }}>
          <ImageLoader coverId={course.coverId} />
        </Box>


        <Stack
          sx={{
            flex: 1,
            gap: 2,
            alignItems: 'end',
          }}
        >

          <Typography>
            {course.id}
          </Typography>
          <Typography sx={{ background: '#ffaa00', display: 'block', borderRadius: 0.5, color: 'black', px: 0.8, py: 0.4, fontSize: '0.7rem' }}>
            بخش اول
          </Typography>

          <Typography
            sx={{
              color: 'text.primary',
              textAlign: 'right'
            }}
          >
            {course.title}
          </Typography>

          <Typography
            variant='h6'
            sx={{
              color: 'text.secondary',
              fontSize: '0.8rem',
              textAlign: 'right'
            }}
          >
            {course.description}
          </Typography>

          <TextCarousel items={
            [
              <Stack direction='row' sx={{ direction: 'rtl', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.4 }}>در این دوره</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'orange' }}>30 تا داستان</Typography>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.4 }}>میخونی</Typography>
              </Stack>,
              <Stack direction='row' sx={{ direction: 'rtl', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.4 }}>در این دوره</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'orange' }}>20 تا گرامر مهم</Typography>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.4 }}>یاد میگیری</Typography>
              </Stack>,
              <Stack direction='row' sx={{ direction: 'rtl', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.4 }}>در این دوره</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'orange' }}>300 تا کلمه</Typography>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.4 }}>یاد میگیری</Typography>
              </Stack>,
            ]
          } />

          {/* <Stack direction='row' sx={{ direction: 'rtl', fontSize: '0.8rem', alignItems: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <Box sx={{ ml: 1 }}>
              <Typography sx={{ fontSize: 'inherit' }}>در این دوره با</Typography>
            </Box>
            <Box sx={{ ml: 1, color: 'secondary.main' }}>
              <ReplaceTypeWriter words={['25 درس', '30 داستان', '10 گرامر', '300 کلمه']} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 'inherit' }}>آشنا میشید</Typography>
            </Box>
          </Stack> */}

          <Stack spacing={1} sx={{ width: '100%' }}>
            <DottedProgress value={progress} />
            <Typography
              sx={{
                color: '#2aa15b',
                fontSize: '0.6rem',
                textAlign: 'right',
              }}
            >
              {course.completedLessonsCount} / {course.totalLessonsCount}
            </Typography>
          </Stack>

          <FancyButton
            fullWidth
            onClick={handleNavigateToCourseDetail}
            variant='contained' >بریم شروع کنیم</FancyButton>

        </Stack>


      </Paper>
    </Box>
  );
}
