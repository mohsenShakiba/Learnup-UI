import { Box, ButtonBase, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AppIcon } from './AppIcon';

export const ROOT_TABS = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Courses', icon: 'school', path: '/' },
  { label: 'Leitner', icon: 'layers', path: '/leitner-box' },
  { label: 'Library', icon: 'menu_book', path: '/library' },
  { label: 'Vocab', icon: 'search', path: '/vocab' },
  { label: 'Vocab', icon: 'chat_bubble', path: '/vocab' },
];

const tabs = ROOT_TABS;
const LEITNER_REVIEW_PATH_PREFIX = "/boxlevel/";

export function isBottomNavVisible (pathname: string) {
  return (
    pathname.startsWith(LEITNER_REVIEW_PATH_PREFIX) ||
    tabs.some(t => t.path === pathname)
  );
}


export function BottomNav () {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const isLeitnerReviewRoute = location.pathname.startsWith(LEITNER_REVIEW_PATH_PREFIX);

  if (!isBottomNavVisible(location.pathname)) {
    return null;
  }

  const currentTab = tabs.findIndex((tab) => {
    if (isLeitnerReviewRoute) {
      return tab.path === "/leitner-box";
    }

    return tab.path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(tab.path);
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '10px',
        right: '10px',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.5,
          px: 1,
          py: 1,
          borderRadius: '999px',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)',
          backgroundColor: isDark ? 'rgba(40,38,46,0.55)' : 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.45)'
            : '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = index === currentTab;
          return (
            <ButtonBase
              key={`${tab.path}-${index}`}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 60,
                height: 40,
                borderRadius: '999px',
                color: 'text.secondary',
                backgroundColor: 'transparent',
                transition: theme.transitions.create(
                  ['background-color', 'transform'],
                  { duration: theme.transitions.duration.shorter }
                ),
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.04)',
                },
                '&:active': {
                  transform: 'scale(0.92)',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(52,88,235,0.4)',
                  opacity: isActive ? 1 : 0,
                  transition: theme.transitions.create(['opacity'], {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                }}
              />
              <AppIcon
                sx={{
                  position: 'relative',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  transition: theme.transitions.create(['color', 'opacity'], {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                }}
              >
                {tab.icon}
              </AppIcon>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
