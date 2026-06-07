import { Box, Card, Typography } from '@mui/material';

type StoryListItemProps = {
  storyId: number;
};

export function StoryListItem ({ storyId }: StoryListItemProps) {
  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          #{storyId}
        </Typography>
        <Typography variant="body1">Story {storyId}</Typography>
      </Box>
    </Card>
  );
}
