import { AppBar, Box, Divider, Stack, Toolbar, Typography } from '@mui/material';
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
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            maxWidth: 960,
            mx: 'auto',
            px: { xs: 2, sm: 2 },
            boxSizing: 'border-box',
          }}
        >
          <Typography
            component="span"
            variant="h6"
            color="primary"
            sx={{ fontWeight: 800 }}
          >
            Learnup
          </Typography>
        </Toolbar>
      </AppBar>

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
              <Divider />
            </>
          )}

          <Box>{children}</Box>
        </Stack>
      </Box>
    </>
  );
}
