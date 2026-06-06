import { Box, Card, Typography } from '@mui/material';
import type { StoryItemResponse } from '../../../api/Learnup';

type StoryItemProps = {
  item: StoryItemResponse;
  isActive: boolean;
  showTranslation: boolean;
  onPlay: (itemId: number) => void;
};

export function StoryItem ({ item, isActive, showTranslation, onPlay }: StoryItemProps) {
  const itemId = item.id;

  const handlePlay = () => {
    if (itemId != null) {
      onPlay(itemId);
    }
  };

  return (
    <Box
      key={item.id}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && itemId != null) {
          event.preventDefault();
          onPlay(itemId);
        }
      }}
    >
      <Card
        sx={{
          border: '1px solid',
          borderColor: isActive ? 'primary.main' : 'divider',
          backgroundColor: isActive ? 'primary.50' : 'background.paper',
          cursor: 'pointer',
        }}
      >
        <Typography>
          {item.content}
        </Typography>

        {
          showTranslation && <Typography>
            {item.translation}
          </Typography>
        }
      </Card>
    </Box>
  );
}
