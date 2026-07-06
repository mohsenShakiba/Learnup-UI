import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  SwipeableDrawer,
  Switch,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersService } from '../../api/Learnup';
import { getFileById } from '../../services/fetchFile';
import { AppIcon } from '../../shared/components/AppIcon';
import { useThemeMode } from '../../shared/theme/themeMode';
import { clearAuth } from '../../stores/authStore';

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { isDark, setMode } = useThemeMode();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => UsersService.getProfile(),
    enabled: open,
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

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    clearAuth();
    navigate('/login');
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={() => undefined}
      disableBackdropTransition
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: 350, sm: 380 },
          maxWidth: 'calc(100vw - 40px)',
          height: '100dvh',
          px: 2.5,
          py: 2,
          bgcolor: 'background.default',
          borderRadius: 0,
        },
      }}
    >
      <ListItemButton
        onClick={() => go('/profile')}
        sx={{ flexGrow: 0, px: 0, pb: 2 }}
      >
        <Avatar
          src={avatarUrl ?? undefined}
          sx={{ width: 50, height: 50, fontSize: '1.25rem', mr: 1.5 }}
        >
          {!avatarUrl && (profile?.displayName?.[0]?.toUpperCase() ?? undefined)}
        </Avatar>
        <Stack spacing={0}>
          <Typography variant="subtitle1" >
            {profile?.displayName ?? '...'}
          </Typography>
          <Typography variant='caption'>اشتراک فعال</Typography>
        </Stack>
      </ListItemButton>

      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        <ListItemButton sx={{ height: 45 }} onClick={() => go('/settings/subscriptions')}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>لیست اشتراک ها</Typography>
          <Box sx={{ flex: 1 }} />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton sx={{ height: 45 }} onClick={() => go('/placement')}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>آزمون تعیین سطح</Typography>
          <Box sx={{ flex: 1 }} />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton sx={{ height: 45 }} >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>لیست دروس گرامر</Typography>
          <Box sx={{ flex: 1 }} />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton sx={{ height: 45 }} >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>ارتباط با ما</Typography>
          <Box sx={{ flex: 1 }} />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton sx={{ height: 45 }} >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>گزارش خطا</Typography>
          <Box sx={{ flex: 1 }} />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
      </Paper>

      <Box sx={{ flex: 1 }} />

      <Paper sx={{ p: 0 }}>
        <ListItem
          secondaryAction={
            <Switch
              edge="end"
              checked={isDark}
              onChange={(e) => setMode(e.target.checked ? 'dark' : 'light')}
            />
          }
        >
          <ListItemIcon>
            <AppIcon>{isDark ? 'dark_mode' : 'light_mode'}</AppIcon>
          </ListItemIcon>
          <ListItemText primary={isDark ? 'حالت تاریک' : 'حالت روشن'} />
        </ListItem>
      </Paper>


      <Paper sx={{ p: 0, overflow: 'hidden', mt: 2 }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <AppIcon sx={{ color: 'error.main' }}>logout</AppIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography color="error">خروج از حساب</Typography>} />
        </ListItemButton>
      </Paper>
    </SwipeableDrawer>
  );
}
