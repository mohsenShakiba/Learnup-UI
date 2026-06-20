import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { DotGrid } from './DotGrid';

type ScaffoldProps = {
  header?: ReactNode;
  children: ReactNode;
  disablePadding?: boolean;
  maxWidth?: string | number;
};

export function Scaffold({
  header,
  children,
  disablePadding,
  maxWidth = '500px',
}: ScaffoldProps) {
  return (
    <Box sx={{ p: 0, position: 'relative', minHeight: 'calc(100vh - 56px)' }}>
      {header && <>{header}</>}
      <DotGrid />
      <Box
        component="main"
        sx={{
          maxWidth,
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
