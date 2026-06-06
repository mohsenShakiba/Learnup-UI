import { Box, Card, Typography } from '@mui/material';
import type { StoryItemResponse } from '../../../api/Learnup';
import { useStoryAudio } from '../hooks/useStoryAudio';

type StoryItemProps = {
  item: StoryItemResponse;
};

export function StoryItem ({ item }: StoryItemProps) {

  const { activeItemId, playbackStatus, showTranslation, play } = useStoryAudio();

  const isActive = playbackStatus === 'playing' && activeItemId === item.id;

  return (
    <Box
      key={item.id}
      onClick={play}
      role="button"
      tabIndex={0}
    >
      <Card
        sx={(theme) => ({
          border: '1px solid',
          borderColor: isActive ? 'primary.main' : 'divider',
          cursor: 'pointer',
          transition: theme.transitions.create(['border-color'], {
            duration: theme.transitions.duration.short,
          }),
        })}
      >
        <Typography >
          {item.content}
        </Typography>

        {
          showTranslation && <Typography sx={{ color: 'text.secondary', textAlign: 'right', direction: 'rtl' }}>
            {item.translation}
          </Typography>
        }
      </Card>
    </Box>
  );
}
