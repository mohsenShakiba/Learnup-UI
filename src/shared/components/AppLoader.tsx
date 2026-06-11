import { Box, CircularProgress, Typography } from '@mui/material';

type AppLoaderProps = {
  text?: string;
};

export function AppLoader ({
  text = 'در حال بارگذاری...',
}: AppLoaderProps) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '60vh',
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
