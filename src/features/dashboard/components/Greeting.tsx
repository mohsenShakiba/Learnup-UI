import { Box, Stack, Typography } from '@mui/material';

type Props = {
  name?: string;
  motivationalSentence?: string;
};

function getGreeting (): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'صبح بخیر';
  if (hour < 17) return 'بعدازظهر بخیر';
  return 'شب بخیر';
}

export function Greeting ({ name, motivationalSentence }: Props) {
  return (
    <Box sx={{ px: 1, py: 0.5 }}>
      <Stack direction='row' sx={{ gap: 0.5 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {getGreeting()}
        </Typography>
        <Typography variant="h6">
          {name}
        </Typography>
        <Typography variant="h6">
          👋
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {motivationalSentence}
      </Typography>
    </Box>
  );
}
