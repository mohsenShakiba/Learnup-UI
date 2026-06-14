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
    <Container maxWidth={maxWidth} sx={{ p: 1 }}>

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
          px: 1,
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
