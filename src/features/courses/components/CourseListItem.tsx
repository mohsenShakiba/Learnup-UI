import type { SxProps, Theme } from '@mui/material';
import { Box, Button, GlobalStyles, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { CourseResponse } from '../../../api/Learnup';
import { TypeWriter } from '../../../components/TypeWriter';

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

        <GlobalStyles styles={`
          @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(0,-5px); } }
          @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(10px,-5px); } }
          @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(5px,5px); } }
          @keyframes float4 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-10px,-10px); } }
          @keyframes float5 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-0px,10px); } }
          @keyframes floatRocket { 0%,100% { transform: translate(-50%,-50%); } 50% { transform: translate(-50%,-58%); } }
          @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        `} />
        <Box sx={{ flex: 1, position: 'relative', minHeight: 180 }}>
          {/* Rocket — center */}
          <Box component='img' src='/images/course1/rocket.png' width={130}
            sx={{
              position: 'absolute', top: '50%', left: '50%',
              animation: 'floatRocket 10s ease-in-out infinite'
            }} />

          {/* pen — top center */}
          <Box component='img' src='/images/course1/pen.png' width={40}
            sx={{
              position: 'absolute', top: '5%', left: '60%', transform: 'translateX(-50%)',
              animation: 'float1 10s ease-in-out infinite'
            }} />

          {/* cup — right */}
          <Box component='img' src='/images/course1/cup.png' width={86}
            sx={{
              position: 'absolute', top: '30%', right: '5%',
              animation: 'float2 10s ease-in-out infinite 0.4s'
            }} />

          {/* suitcase — bottom right */}
          <Box component='img' src='/images/course1/suitcase.png' width={90}
            sx={{
              position: 'absolute', bottom: '5%', right: '15%',
              animation: 'float3 10s ease-in-out infinite 0.8s'
            }} />

          {/* book — bottom left */}
          <Box component='img' src='/images/course1/book.png' width={80}
            sx={{
              position: 'absolute', bottom: '5%', left: '10%',
              animation: 'float4 10s ease-in-out infinite 1.2s'
            }} />

          {/* plant — left */}
          <Box component='img' src='/images/course1/plant.png' width={80}
            sx={{
              position: 'absolute', top: '10%', left: '5%',
              animation: 'float5 10s ease-in-out infinite 0.6s'
            }} />
        </Box>


        <Stack
          sx={{
            flex: 1,
            px: 1.5,
            justifyContent: 'space-around'
          }}
        >

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

          <Stack direction='row' sx={{ direction: 'rtl', fontSize: '0.8rem', alignItems: 'center', color: 'rgba(255,255,255,0.4)' }}>

            <Box sx={{ ml: 1 }}>
              <Typography sx={{ fontSize: 'inherit' }}>با کلماتی مثل</Typography>
            </Box>
            <Box sx={{ ml: 1 }}>
              <TypeWriter words={['BOOOK', 'FRIEND', 'SCHOOL', 'MEETING']} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 'inherit' }}>آشنا میشید</Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
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

        </Stack>


      </Paper>
    </Box>
  );
}
