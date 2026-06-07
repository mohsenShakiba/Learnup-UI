import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';

type StoryCoverHeaderProps = {
  storyId: number | undefined;
  title: string | null | undefined;
};

export function StoryCoverHeader ({ storyId, title }: StoryCoverHeaderProps) {
  return (
    <Box
      sx={{
        m: 2,
        mb: 0,
        position: 'relative',
        height: 220,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundImage: 'url(/images/story_cover.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box sx={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(0,0,0,0.2)',
        width: 38, height: 38, borderRadius: 999, position: 'absolute', zIndex: 1, left: 8, top: 8
      }}>
        <IconButton>
          <Icon>arrow_back</Icon>
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
          LESSON {storyId}
        </Typography>
        <Typography variant='h5' sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
          {title}
        </Typography>
      </Stack>
    </Box>
  );
}
