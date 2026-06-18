import { Box, Container } from '@mui/material';
import type { ReactNode } from 'react';
import { DotGrid } from './DotGrid';

type ScaffoldProps = {
  header?: ReactNode;
  children: ReactNode;
  disablePadding?: boolean
};

export function Scaffold({ header, children, disablePadding }: ScaffoldProps) {

  return (
    <Box sx={{ p: 0, position: 'relative', minHeight: 'calc(100vh - 56px)' }}>

      {header && (
        <>
          {header}
        </>
      )}
      <DotGrid />
      <Box
        component="main"
        sx={{
          maxWidth: '500px',
          mx: 'auto',
          py: disablePadding ? 0 : 2,
          px: disablePadding ? 0 : 2,
          boxSizing: 'border-box',
        }}
      >
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
