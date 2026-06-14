import { Box, Icon, IconButton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type DefaultHeaderProps = {
  header: string;
  subtitle?: string;
  children?: ReactNode;
};

export function DefaultHeader ({ header, subtitle, children }: DefaultHeaderProps) {

  const navigate = useNavigate();

  return (
    <Stack direction='row' spacing={1} sx={{
      alignItems: 'center', bgcolor: 'Background.paper', border: '1px solid',
      borderColor: 'divider', borderRadius: 999, px: 1, py: 1,
      position: 'sticky', top: 16, left: 0, right: 0,
      zIndex: 1, backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.1)',
    }}>
      <IconButton onClick={() => navigate(-1)}>
        <Icon sx={{ opacity: 0.5 }}>arrow_forward</Icon>
      </IconButton>
      <Stack >
        <Typography>
          {header}
        </Typography>
        {subtitle && <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {subtitle}
        </Typography>}
      </Stack>
      <Box sx={{ flex: 1 }}></Box>
      {children}
    </Stack>
  );
}
