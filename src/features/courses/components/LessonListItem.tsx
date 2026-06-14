import { Box, Icon, Stack, Typography } from '@mui/material';
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

function StoryIcon ({ completed }: { completed: boolean; }) {
  return (
    <Box sx={{
      bgcolor: completed ? 'success.dark' : 'rgba(255,255,255,0.1)',
      borderRadius: '6px',
      backdropFilter: 'blur(5px)', width: 25, height: 25, alignItems: 'center', justifyContent: 'center', display: 'flex'
    }}>
      <Icon sx={{
        fontSize: 15,
        color: completed ? 'white' : 'text.secondary',
      }}>
        auto_stories
      </Icon>
    </Box>
  );
}

function GrammarIcon ({ completed }: { completed: boolean; }) {
  return (
    <Box sx={{
      bgcolor: completed ? 'secondary.dark' : 'rgba(125,125,125,0.3)',
      borderRadius: '6px',
      backdropFilter: 'blur(5px)', width: 25, height: 25, alignItems: 'center', justifyContent: 'center', display: 'flex'
    }}>
      <Icon sx={{
        fontSize: 15,
        color: completed ? 'white' : 'text.secondary',
      }}>
        lightbulb
      </Icon>
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
      <LessonTimeline completed={lesson.isCompleted} isLast={isLast} />
      <ActionCard onClick={navigateToLesson} sx={{ flex: 1 }}>

        <Stack spacing={1} sx={{ overflow: 'hidden', alignItems: 'flex-start' }}>

          <Stack spacing={1} sx={{ alignItems: 'start' }}>
            <Typography >
              درس {lesson.order}
            </Typography>
            <Typography sx={{ color: 'text.secondary', }}>
              {lesson.title}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            {lesson.storiesCount > 0 && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {Array.from({ length: lesson.storiesCount }).map((_, i) => (
                  <StoryIcon key={i} completed={i < lesson.completedStoriesCount} />
                ))}
              </Stack>
            )}

            {lesson.grammarsCount > 0 && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {Array.from({ length: lesson.grammarsCount }).map((_, i) => (
                  <GrammarIcon key={i} completed={i < lesson.completedGrammarsCount} />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </ActionCard >
    </Stack>
  );
}
