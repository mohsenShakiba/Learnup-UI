import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';
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
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              top: '40%',
              borderRadius: 1,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
              backdropFilter: 'blur(4px)',
              maskImage: 'linear-gradient(to top, black 40%, transparent)',
            }}
          />
          <Typography sx={{ position: 'absolute', bottom: 8, left: 8, color: 'common.white' }} >
            {story.title}
          </Typography>
        </Box>


        {/* Status badges */}
        <Box  >
          <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>

            <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'info.main', fontSize: '0.7rem', px: 0.8, py: 0.3 }}>
              <Icon sx={{ fontSize: '0.8rem' }}>auto_stories</Icon>
              <Box>داستان</Box>
            </Stack>

            <DurationBadge minutes={5} />

            <Box sx={{ flex: 1 }}></Box>

            {story.isCompleted ? (
              <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', px: 0.8, py: 0.4, fontSize: '0.7rem', bgcolor: 'success.main', borderRadius: 1 }}>
                <Icon sx={{ fontSize: '0.8rem' }}>check_circle</Icon>
                <Box>کامل شده</Box>
              </Stack>
            ) : (
              <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', px: 0.8, py: 0.4, fontSize: '0.7rem', bgcolor: 'warning.main', borderRadius: 1 }}>
                <Icon sx={{ fontSize: '0.8rem' }}>hourglass_empty</Icon>
                <Box>در انتظار</Box>
              </Stack>
            )}
          </Stack>

        </Box>
      </Stack>
      {/* Title at top */}


    </ActionCard >
  );
}
