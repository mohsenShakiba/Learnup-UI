import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ImageLoader } from '../../../shared/components/ImageLoader';

type StoryListItemProps = {
  story: StoryResponse;
};


export function StoryListItem ({ story }: StoryListItemProps) {
  const navigate = useNavigate();


  return (
    <Box
      onClick={() => navigate(`/stories/${story.id}`)}
      sx={{
        position: 'relative',
        height: 120,
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        '&:active': { transform: 'scale(0.97)', opacity: 0.85 },
      }}
    >

      <ImageLoader coverId={story.coverId} />

      {/* Gradient from top down, behind the title */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 100%)',
        }}
      />

      {/* Title at top */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, px: 2, pt: 1.5, pb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 1px 6px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {story.title}
        </Typography>

        <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }} >

          <Box sx={{ borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3 }}>
            داستان
          </Box>
          <Icon sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>timer</Icon>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'arial' }}>
            5 Min
          </Typography>
        </Stack>
      </Box>

      {/* Completed badge */}
      {story.isCompleted && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            bgcolor: 'success.main',
            fontSize: '0.7rem !important',
          }}
        >
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={0.5}>
            <Icon sx={{ fontSize: '17px' }}>done</Icon>
            <Typography sx={{ fontSize: 'inherit', fontFamily: 'arial' }}>
              Completed
            </Typography>
          </Stack>

        </Box>
      )}
    </Box>
  );
}
