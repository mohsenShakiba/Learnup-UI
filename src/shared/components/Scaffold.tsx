import { Box, Container, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import { DotGrid } from './DotGrid';

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
          mx: 'auto',
          py: 2,
          paddingBottom: 10,
          boxSizing: 'border-box',
        }}
      >
        <DotGrid />

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
