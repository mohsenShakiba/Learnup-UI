import {
  Box,
  Divider,
  IconButton,
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
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../../shared/components/AppIcon';
import { useThemeMode } from '../../shared/theme/themeMode';
import { clearAuth } from '../../stores/authStore';

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDrawer ({ open, onClose }: SettingsDrawerProps) {
  const { isDark, setMode } = useThemeMode();
  const navigate = useNavigate();

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
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">تنظیمات</Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose} aria-label="Close settings">
          <AppIcon>close</AppIcon>
        </IconButton>
      </Stack>



      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        <ListItemButton onClick={() => go('/profile')}>
          <ListItemIcon>
            <AppIcon>account_circle</AppIcon>
          </ListItemIcon>
          <ListItemText primary="پروفایل" />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => go('/settings/subscriptions')}>
          <ListItemIcon>
            <AppIcon>workspace_premium</AppIcon>
          </ListItemIcon>
          <ListItemText primary="لیست اشتراک ها" />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => go('/placement')}>
          <ListItemIcon>
            <AppIcon>quiz</AppIcon>
          </ListItemIcon>
          <ListItemText primary="آزمون تعیین سطح" />
          <AppIcon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</AppIcon>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => go('/grammar')}>
          <ListItemIcon>
            <AppIcon>menu_book</AppIcon>
          </ListItemIcon>
          <ListItemText primary="گرامرها" />
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
