import { Avatar, Box, Icon, IconButton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UsersService } from '../../api/Learnup';
import { SettingsDrawer } from '../../features/settings/SettingsDrawer';
import { getFileById } from '../../services/fetchFile';
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => UsersService.getProfile(),
    enabled: isRootTab,
  });
  const profile = profileQuery.data;

  useEffect(() => {
    if (!profile?.avatarUrl) {
      setAvatarUrl(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    getFileById(profile.avatarUrl)
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer]));
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setAvatarUrl(url);
      })
      .catch(() => {
        if (!cancelled) setAvatarUrl(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [profile?.avatarUrl]);

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
      bgcolor: 'background.paper'
    }}>
      {!isRootTab ? (
        <IconButton onClick={() => navigate(-1)}>
          <Icon>arrow_forward</Icon>
        </IconButton>
      ) : (
        <IconButton onClick={() => setSettingsOpen(true)}>
          <Icon>menu</Icon>
        </IconButton>
      )}
      <Typography>
        {header}
      </Typography>
      <Box sx={{ flex: 1 }}></Box>

      {isRootTab && (
        <Avatar src={avatarUrl ?? undefined} sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
          {!avatarUrl && (profile?.displayName?.[0]?.toUpperCase() ?? undefined)}
        </Avatar>
      )}

      {children}

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
}
