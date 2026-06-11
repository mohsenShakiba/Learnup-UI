import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { ImageLoader } from '../../../shared/components/ImageLoader';

type StoryListItemProps = {
  story: StoryResponse;
};


export function StoryListItem ({ story }: StoryListItemProps) {
  const navigate = useNavigate();


  return (
    <ActionCard onClick={() => navigate(`/stories/${story.id}`)}>

      <Stack spacing={1.5} >

        <Box sx={{ position: 'relative', height: '120px', }}>
          <ImageLoader sx={{ borderRadius: 1 }} coverId={story.coverId} />
          <Typography sx={{ position: 'absolute', bottom: 8, left: 8 }} >
            {story.title}
          </Typography>
        </Box>


        {/* Completed badge */}
        {story.isCompleted && (
          <Box  >
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>

              <Box sx={{ borderRadius: 1, bgcolor: 'primary.main', fontSize: '0.7rem', px: 0.8, py: 0.3 }}>
                داستان
              </Box>

              <Icon sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>timer</Icon>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'arial' }}>
                5 Min
              </Typography>

              <Box sx={{ flex: 1 }}></Box>

              <Box sx={{ px: 0.8, py: 0.4, fontSize: '0.7rem', bgcolor: 'warning.main', borderRadius: 1 }}>در انتظار</Box>
            </Stack>

          </Box>
        )}
      </Stack>
      {/* Title at top */}


    </ActionCard >
  );
}
