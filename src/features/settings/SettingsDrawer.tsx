import { Icon } from '../../shared/components/Icon';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../../stores/authStore';
import { useThemeMode } from '../../shared/theme/themeMode';

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
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
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: 320, sm: 380 },
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
          <Icon>close</Icon>
        </IconButton>
      </Stack>

      <Paper sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
        <ListItemButton onClick={() => go('/profile')}>
          <ListItemIcon>
            <Icon>account_circle</Icon>
          </ListItemIcon>
          <ListItemText primary="پروفایل" secondary="ویرایش نام و تصویر پروفایل" />
          <Icon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</Icon>
        </ListItemButton>
      </Paper>

      <Paper sx={{ p: 0, overflow: 'hidden' }}>
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
            <Icon>{isDark ? 'dark_mode' : 'light_mode'}</Icon>
          </ListItemIcon>
          <ListItemText primary="Dark mode" secondary={isDark ? 'On' : 'Off'} />
        </ListItem>
        <Divider />
        <ListItemButton onClick={() => go('/settings/subscriptions')}>
          <ListItemIcon>
            <Icon>workspace_premium</Icon>
          </ListItemIcon>
          <ListItemText primary="Subscription" secondary="Manage your plan" />
          <Icon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</Icon>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => go('/grammar')}>
          <ListItemIcon>
            <Icon>menu_book</Icon>
          </ListItemIcon>
          <ListItemText primary="گرامرها" secondary="مشاهده همه گرامرها" />
          <Icon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</Icon>
        </ListItemButton>
      </Paper>

      <Paper sx={{ p: 0, overflow: 'hidden', mt: 2 }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Icon sx={{ color: 'error.main' }}>logout</Icon>
          </ListItemIcon>
          <ListItemText primary={<Typography color="error">خروج از حساب</Typography>} />
        </ListItemButton>
      </Paper>
    </Drawer>
  );
}
