import { Box, Divider, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type ScaffoldProps = {
  title: ReactNode;
  children: ReactNode;
};

export function Scaffold ({ title, children }: ScaffoldProps) {
  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        maxWidth: 960,
        mx: 'auto',
        px: 2,
        py: 3,
        boxSizing: 'border-box',
      }}
    >
      <Stack spacing={2}>
        <Typography>
          {title}
        </Typography>

        <Divider />

        <Box>{children}</Box>
      </Stack>
    </Box>
  );
}
