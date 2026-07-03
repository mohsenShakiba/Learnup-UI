import { Box } from '@mui/material';
import { AppIcon } from '../../../shared/components/AppIcon';

const CIRCLE_SIZE = 28;
const ITEM_GAP = 16;

type LessonTimelineProps = {
  completed: boolean;
  isLast: boolean;
};

export function LessonTimeline({ completed, isLast }: LessonTimelineProps) {
  const color = completed ? 'success.main' : 'text.secondary';

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: CIRCLE_SIZE,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: '50%',
          bgcolor: completed ? color : 'transparent',
          border: '2px solid',
          borderColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: completed ? 1 : 0.3,
          zIndex: 1,
        }}
      >
        {completed ? (
          <AppIcon sx={{ fontSize: 16, color: 'white' }}>check</AppIcon>
        ) : (
          <AppIcon sx={{ fontSize: 16, color: 'text.secondary' }}>hourglass</AppIcon>
        )}
      </Box>
      {!isLast && (
        <Box
          sx={{
            position: 'absolute',
            top: CIRCLE_SIZE,
            bottom: -ITEM_GAP,
            borderLeft: '2px dashed',
            borderColor: color,
            opacity: 0.3,
          }}
        />
      )}
    </Box>
  );
}
