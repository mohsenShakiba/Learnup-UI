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
    <Box sx={{
      alignItems: 'center',
      position: 'sticky', top: 0, left: 0, right: 0,
      zIndex: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 1,
      px: 2,
      bgcolor: 'background.default'
    }}>
      <Stack direction='row' spacing={1} sx={{ maxWidth: '500px', margin: '0 auto', alignItems: 'center' }} >
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
    </Box>
  );
}
