import {
  Divider,
  Icon,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { useThemeMode } from '../../shared/theme/themeMode';

export default function SettingsPage () {
  const { isDark, setMode } = useThemeMode();
  const navigate = useNavigate();

  return (
    <Scaffold header={<DefaultHeader header="Settings" />}>
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
      </Paper>
    </Scaffold>
  );
}
