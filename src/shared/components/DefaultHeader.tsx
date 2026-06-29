import { Avatar, Box, Icon, IconButton, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROOT_TABS } from './BottomNav';

type DefaultHeaderProps = {
  header: string;
  subtitle?: string;
  children?: ReactNode;
};

export function DefaultHeader ({ header, subtitle, children }: DefaultHeaderProps) {

  const navigate = useNavigate();
  const location = useLocation();
  const isRootTab = ROOT_TABS.some((tab) => tab.path === location.pathname);

  return (
    <Box sx={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      position: 'sticky', top: 0, left: 0, right: 0,
      zIndex: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 1,
      px: 2,
      height: 60,
      bgcolor: 'background.default'
    }}>
      {!isRootTab ? (
        <IconButton onClick={() => navigate(-1)}>
          <Icon>arrow_forward</Icon>
        </IconButton>
      ) : (
        <IconButton >
          <Icon>menu</Icon>
        </IconButton>
      )}
      <Typography>
        {header}
      </Typography>
      <Box sx={{ flex: 1 }}></Box>

      {isRootTab && <Avatar sizes='1' />
      }

      {children}
    </Box>
  );
}
