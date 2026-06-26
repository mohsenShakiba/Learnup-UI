import { Box, Button, Divider, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';
import { ImageLoader } from '../../../shared/components/ImageLoader';

type StoryListItemProps = {
  story: StoryResponse;
};


export function StoryListItem({ story }: StoryListItemProps) {
  const navigate = useNavigate();


  return (
    <ActionCard onClick={() => navigate(`/stories/${story.id}`)}>

      <Stack spacing={1}>

        <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>

          <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'info.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
            <Icon sx={{ fontSize: '0.8rem' }}>auto_stories</Icon>
            <Box>داستان</Box>
          </Stack>

          <Box sx={{ flex: 1 }}></Box>

          <DurationBadge minutes={5} />
        </Stack>

        <Divider />

        <Typography sx={{ direction: 'rtl' }} >
          {story.title}
        </Typography>

        <Button size='small'>شروع مکالمه</Button>
      </Stack>

    </ActionCard >
  );
}
