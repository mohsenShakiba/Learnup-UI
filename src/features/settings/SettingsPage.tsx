import {
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
} from '@mui/material';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { useThemeMode } from '../../shared/theme/themeMode';

export default function SettingsPage () {
  const { isDark, setMode } = useThemeMode();

  return (
    <Scaffold header={<DefaultHeader header="Settings" />} maxWidth="sm">
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
      </Paper>
    </Scaffold>
  );
}
