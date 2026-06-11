import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ImageLoader } from '../../../shared/components/ImageLoader';

type StoryCoverHeaderProps = {
  story: StoryResponse;
};

export function StoryCoverHeader ({ story }: StoryCoverHeaderProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        m: 2,
        mb: 0,
        position: 'relative',
        height: 220,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >

      <ImageLoader coverId={story.coverId} />
      <Box sx={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(0,0,0,0.2)',
        width: 38, height: 38, borderRadius: 999, position: 'absolute', zIndex: 1, right: 8, top: 8
      }}>
        <IconButton onClick={() => navigate(-1)}>
          <Icon>arrow_forward</Icon>
        </IconButton>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
        }}
      />
      <Stack
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          px: 2,
          pb: 2,
          pt: 6,
          backdropFilter: 'blur(14px)',
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
        }}
      >
        <Typography variant='caption' sx={{ color: 'primary.light', fontWeight: 700, letterSpacing: 1 }}>
          LESSON {story.id}
        </Typography>
        <Typography variant='h5' sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
          {story.title}
        </Typography>
      </Stack>
    </Box>
  );
}
