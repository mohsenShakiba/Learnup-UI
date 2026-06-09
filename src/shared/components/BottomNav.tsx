import {
  BottomNavigation,
  BottomNavigationAction,
  Icon
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Courses', icon: 'school', path: '/' },
  { label: 'Vocab', icon: 'menu_book', path: '/vocab' },
  { label: 'Chat', icon: 'chat', path: '/chat' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
];

export function BottomNav () {
  const location = useLocation();
  const navigate = useNavigate();

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
          key={tab.path}
          label={tab.label}
          icon={<Icon>{tab.icon}</Icon>}
        />
      ))}
    </BottomNavigation>
  );
}
