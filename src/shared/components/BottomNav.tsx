import {
  BottomNavigation,
  BottomNavigationAction,
  Icon
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export const ROOT_TABS = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Courses', icon: 'school', path: '/' },
  { label: 'Leitner', icon: 'layers', path: '/leitner-box' },
  { label: 'Library', icon: 'menu_book', path: '/library' },
  { label: 'Vocab', icon: 'search', path: '/vocab' },
  { label: 'Settings', icon: 'menu', path: '/settings' },
];

const tabs = ROOT_TABS;


export function BottomNav () {
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
      sx={{ px: 2, pb: 0.5, height: 65 }}
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
