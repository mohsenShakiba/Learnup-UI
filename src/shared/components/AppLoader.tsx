import { Box, CircularProgress, Typography } from '@mui/material';

type AppLoaderProps = {
  text?: string;
  fullHeight?: boolean;
};

export function AppLoader({
  text = 'در حال بارگذاری...',
  fullHeight = true,
}: AppLoaderProps) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: fullHeight ? '60vh' : 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
