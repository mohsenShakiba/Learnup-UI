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
    <Stack direction='row' spacing={1} sx={(theme) => ({
      alignItems: 'center', bgcolor: 'Background.paper', border: '1px solid',
      borderColor: 'divider', borderRadius: 2, px: 1, py: 1,
      position: 'sticky', top: 8, left: 8, right: 8,
      zIndex: 1, backdropFilter: 'blur(20px)',
      background: `color-mix(in srgb, ${theme.palette.background.default} 70%, transparent 20%)`
    })}>
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
