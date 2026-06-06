import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

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
      <Typography
        component="h1"
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Box>{children}</Box>
    </Box>
  );
}
