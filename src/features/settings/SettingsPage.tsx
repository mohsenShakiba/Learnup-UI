import {
  Box,
  Divider,
  Icon,
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
import { Scaffold } from '../../shared/components/Scaffold';
import { useThemeMode } from '../../shared/theme/themeMode';

export default function SettingsPage() {
  const { isDark, setMode } = useThemeMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <Scaffold >

      <Stack direction='row' sx={{ alignItems: 'end', pb: 2 }}>
        <Typography sx={{ px: 2 }} variant='body1'>تنظیمات</Typography>
        <Box sx={{ flex: 1 }} />
      </Stack>

      <Paper sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
        <ListItemButton onClick={() => navigate('/profile')}>
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
          <ListItemText
            primary="Dark mode"
            secondary={isDark ? 'On' : 'Off'}
          />
        </ListItem>
        <Divider />
        <ListItemButton onClick={() => navigate('/settings/subscriptions')}>
          <ListItemIcon>
            <Icon>workspace_premium</Icon>
          </ListItemIcon>
          <ListItemText primary="Subscription" secondary="Manage your plan" />
          <Icon sx={{ opacity: 0.4, fontSize: 18 }}>chevron_left</Icon>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate('/grammar')}>
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
    </Scaffold>
  );
}
