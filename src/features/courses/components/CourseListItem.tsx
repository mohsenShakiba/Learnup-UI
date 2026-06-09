import type { SxProps, Theme } from '@mui/material';
import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { CourseResponse } from '../../../api/Learnup';

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
      height: '100%', p: 3,
      display: 'flex',
      boxSizing: 'border-box',
      flexDirection: 'column',

    }}>
      <Paper
        sx={
          {
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }
      >

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src='/images/course1/rocket.png' width={100} />
          <img src='/images/course1/pen.png' width={50} />
        </Box>


        <Stack
          sx={{

            px: 1.5,
            pb: 8,
            pt: 5,
          }}
        >
          <Typography
            variant='h6'
            sx={{
              color: '#fff',
              textAlign: 'right'
            }}
          >
            {course.title}
          </Typography>

          <Typography
            variant='h6'
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              textAlign: 'right'
            }}
          >
            {course.description}
          </Typography>

        </Stack>

        <Stack spacing={0.5} sx={{}}>
          <LinearProgress
            variant='determinate'
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.5)',
            }}
          />
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

        <Button
          onClick={handleNavigateToCourseDetail}
          sx={{
            backdropFilter: 'blur(5px)',
            borderColor: 'white',
            color: 'white',
            fontWeight: 100,
          }} variant='outlined' >بریم شروع کنیم</Button>

      </Paper>
    </Box>
  );
}
