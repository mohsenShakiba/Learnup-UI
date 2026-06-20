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
  { label: 'Settings', icon: 'settings', path: '/settings' },
];

const hiddenPaths = ['/stories/'];

export function BottomNav () {
  const location = useLocation();
  const navigate = useNavigate();

  if (hiddenPaths.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  const currentTab = tabs.findIndex((tab) =>
    tab.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(tab.path)
  );

  return (

    <BottomNavigation
      value={currentTab === -1 ? false : currentTab}
      onChange={(_, newValue) => navigate(tabs[newValue].path)}
    >
      {tabs.map((tab) => (
        <BottomNavigationAction
          sx={{
            minWidth: 0,
            px: 0.5,
            '& .MuiBottomNavigationAction-label': {
              fontSize: '10px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'center',
            },
          }}
          key={tab.path}
          label={tab.label}
          icon={<Icon>{tab.icon}</Icon>}
        />
      ))}
    </BottomNavigation>
  );
}
