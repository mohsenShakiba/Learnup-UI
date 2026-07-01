import { Icon } from '../../../shared/components/Icon';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LessonResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';

type LessonListItemProps = {
  lesson: LessonResponse;
  isLast?: boolean;
};

const CIRCLE_SIZE = 28;
// matches the parent Stack `spacing={2}` (16px) so the line bridges the gap to the next circle
const ITEM_GAP = 16;

function LessonTimeline ({ completed, isLast }: { completed: boolean; isLast: boolean; }) {
  const color = completed ? 'success.main' : 'warning.main';
  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: CIRCLE_SIZE,
      flexShrink: 0,
    }}>
      <Box sx={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: '50%',
        bgcolor: completed ? color : 'transparent',
        border: '2px solid',
        borderColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        {completed ? (
          <Icon sx={{ fontSize: 16, color: 'white' }}>check</Icon>
        ) : (
          <Icon sx={{ fontSize: 16, color: 'warning.main' }}>hourglass</Icon>
        )}
      </Box>
      {!isLast && (
        <Box sx={{
          position: 'absolute',
          top: CIRCLE_SIZE,
          bottom: -ITEM_GAP,
          width: 2,
          bgcolor: color,
        }} />
      )}
    </Box>
  );
}


export function LessonListItem ({ lesson, isLast = false }: LessonListItemProps) {

  const navigate = useNavigate();
  const navigateToLesson = () => {
    navigate(`/lessons/${lesson.id}`);
  };


  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'stretch' }}>


      <ActionCard onClick={navigateToLesson} sx={{ flex: 1, borderRadius: 2 }}>

        <Stack spacing={1} sx={{ alignItems: 'flex-end' }}>
          <Typography sx={{ px: 0.8, py: 0.4, bgcolor: 'secondary.main', color: 'white', borderRadius: 1, fontSize: '0.7rem', fontFamily: 'Roboto' }} >
            Lesson {lesson.order}
          </Typography>
          <Typography sx={{ color: 'text.secondary', direction: 'rtl' }}>
            {lesson.title}
          </Typography>
        </Stack>

      </ActionCard >

      <LessonTimeline completed={lesson.isCompleted} isLast={isLast} />


    </Stack>
  );
}
