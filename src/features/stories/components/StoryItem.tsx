import { Box, Card, Typography } from '@mui/material';
import type { StoryItemResponse } from '../../../api/Learnup';
import { useStoryItem } from '../hooks/useStoryItem';

type StoryItemProps = {
  item: StoryItemResponse;
};

export function StoryItem ({ item }: StoryItemProps) {
  const itemId = item.id;
  const { isActive, showTranslation, playItem } = useStoryItem(item);

  return (
    <Box
      key={item.id}
      onClick={playItem}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && itemId != null) {
          event.preventDefault();
          playItem();
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
