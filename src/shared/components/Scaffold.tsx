import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type ScaffoldProps = {
  title?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
};

export function Scaffold ({ title, header, children }: ScaffoldProps) {
  const scaffoldHeader = header ?? (title ? (
    <Typography>
      {title}
    </Typography>
  ) : null);

  return (
    <>


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
          {scaffoldHeader && (
            <>
              {scaffoldHeader}
            </>
          )}

          <Box>{children}</Box>
        </Stack>
      </Box>
    </>
  );
}
