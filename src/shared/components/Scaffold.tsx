import { Box, Container } from '@mui/material';
import type { ReactNode } from 'react';
import { DotGrid } from './DotGrid';

type ScaffoldProps = {
  header?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md';
};

export function Scaffold ({ header, children, maxWidth }: ScaffoldProps) {

  return (
    <Container maxWidth={maxWidth} sx={{ p: 0 }}>

      {header && (
        <>
          {header}
        </>
      )}

      <Box
        component="main"
        sx={{
          width: '100%',
          mx: 'auto',
          py: 2,
          px: 2,
          paddingBottom: 10,
          boxSizing: 'border-box',
        }}
      >
        <DotGrid />
        <Box>{children}</Box>
      </Box>
    </Container>
  );
}
