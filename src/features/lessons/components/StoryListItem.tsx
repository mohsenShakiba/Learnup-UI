import { Box, Chip, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { OpenAPI } from '../../../api/Learnup';

type StoryListItemProps = {
  story: StoryResponse;
};

const FALLBACK_COVER = '/images/story_cover.png';

export function StoryListItem ({ story }: StoryListItemProps) {
  const navigate = useNavigate();

  const coverUrl = story.coverId
    ? `${OpenAPI.BASE}/Mobile/Files/${story.coverId}`
    : FALLBACK_COVER;

  return (
    <Box
      onClick={() => navigate(`/stories/${story.id}`)}
      sx={{
        position: 'relative',
        height: 120,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        '&:active': { transform: 'scale(0.97)', opacity: 0.85 },
      }}
    >
      {/* Cover image */}
      <Box
        component="img"
        src={coverUrl}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

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

        <Stack direction='row' spacing={0.5}>
          <Icon sx={{ fontSize: '0.8rem' }}>timer</Icon>
          <Typography sx={{ fontSize: '0.7rem' }}>
            8 MIN
          </Typography>
        </Stack>
      </Box>

      {/* Completed badge */}
      {story.isCompleted && (
        <Chip
          label="COMPLETED"
          size="small"
          color='success'
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            px: 1.5,
            letterSpacing: '2px',
            fontSize: '0.7rem !important',
            fontFamily: 'sans-serif'
          }}
        />
      )}
    </Box>
  );
}
