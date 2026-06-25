import {
  BottomNavigation,
  BottomNavigationAction,
  Icon
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Courses', icon: 'school', path: '/' },
  { label: 'Vocab', icon: 'menu_book', path: '/vocab' },
  { label: 'Leitner', icon: 'layers', path: '/leitner-box' },
  { label: 'Library', icon: 'local_library', path: '/library' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
];


export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!tabs.some(t => t.path === location.pathname)) {
    return null;
  }

  const currentTab = tabs.findIndex((tab) =>
    tab.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(tab.path)
  );

  return (

    <BottomNavigation
      sx={{ px: 2 }}
      value={currentTab === -1 ? false : currentTab}
      onChange={(_, newValue) => navigate(tabs[newValue].path)}
    >
      {tabs.map((tab) => (
        <BottomNavigationAction
          sx={{
            minWidth: 0,
            px: 0.5,
          }}
          key={tab.path}
          icon={<Icon>{tab.icon}</Icon>}
        />
      ))}
    </BottomNavigation>
  );
}
