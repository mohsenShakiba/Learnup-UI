import { Box, Container, Stack } from '@mui/material';
import type { ReactNode } from 'react';

type ScaffoldProps = {
  header?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md';
};

export function Scaffold ({ header, children, maxWidth }: ScaffoldProps) {

  return (
    <Container maxWidth={maxWidth}>
      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 960,
          mx: 'auto',
          py: 2,
          boxSizing: 'border-box',
        }}
      >
        <Stack spacing={2}>
          {header && (
            <>
              {header}
            </>
          )}
          <Box>{children}</Box>
        </Stack>
      </Box>
    </Container>
  );
}
