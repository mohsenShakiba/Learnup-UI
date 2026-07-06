import { Box, CircularProgress, Typography } from '@mui/material';

type AppLoaderProps = {
  text?: string;
  fullHeight?: boolean;
};

export function AppLoader({
  text = 'در حال بارگذاری',
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
        opacity: 0.5,
        color: "text.secondary"
      }}
    >
      <CircularProgress size={25} color='inherit' />
      <Typography variant="body2" color="inherit">
        {text}
      </Typography>
    </Box>
  );
}
