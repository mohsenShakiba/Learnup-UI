import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { CourseResponse } from '../../../api/Learnup';
import { OpenAPI } from '../../../api/Learnup';

type CourseListItemProps = {
  course: CourseResponse;
};

const FALLBACK_COVER = '/images/course_cover.png';

export function CourseListItem ({ course }: CourseListItemProps) {

  const navigate = useNavigate();

  const coverUrl = course.coverId
    ? `${OpenAPI.BASE}/Mobile/Files/${course.coverId}`
    : FALLBACK_COVER;

  const progress = course.totalLessonsCount > 0
    ? (course.completedLessonsCount / course.totalLessonsCount) * 100
    : 0;

  const handleNavigateToCourseDetail = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: 250,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >

      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',

      }}>
      </Box>

      <Box
        component='img'
        sx={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
        }}
        src={coverUrl} />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
        }}
      />

      <Stack
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          px: 1.5,
          pb: 8,
          pt: 5,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
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

      <Stack spacing={0.5} sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
      }}>
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
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderColor: 'white',
          color: 'white',
          fontWeight: 100,
        }} variant='outlined' >بریم شروع کنیم</Button>

    </Box>
  );
}
