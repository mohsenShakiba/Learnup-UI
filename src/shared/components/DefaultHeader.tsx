import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type DefaultHeaderProps = {
  header: string;
  children?: ReactNode;
};

export function DefaultHeader ({ header, children }: DefaultHeaderProps) {

  const navigate = useNavigate();

  return (
    <Stack direction='row' spacing={1} sx={{ alignItems: 'center', justifyContent: 'end' }}>

      {children}

      <Box sx={{ flex: 1 }}></Box>
      <Typography>
        {header}
      </Typography>
      <IconButton onClick={() => navigate(-1)}>
        <Icon sx={{ opacity: 0.5 }}>arrow_forward</Icon>
      </IconButton>
    </Stack>
  );
}
