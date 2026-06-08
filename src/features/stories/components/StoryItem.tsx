import { Box, Card, Typography } from '@mui/material';
import type { StoryItemResponse } from '../../../api/Learnup';
import { useStoryAudio } from '../hooks/useStoryAudio';

type StoryItemProps = {
  item: StoryItemResponse;
};

export function StoryItem ({ item }: StoryItemProps) {

  const { activeItemId, playbackStatus, showTranslation, playItemAudio } = useStoryAudio();

  const isActive = playbackStatus === 'playing' && activeItemId === item.id;

  const play = () => {
    if (item.id != null) {
      void playItemAudio(item.id);
    }
  };

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
          opacity: isActive ? '1' : '0.5',
          transition: theme.transitions.create(['border-color', 'opacity'], {
            duration: theme.transitions.duration.short,
          }),
        })}
      >
        <Typography >
          {item.content}
        </Typography>

        {
          showTranslation && <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'right', direction: 'rtl' }}>
            {item.translation}
          </Typography>
        }
      </Card>

    </Box>
  );
}
