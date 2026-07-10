import type { MaterialSymbolsComponent } from "@material-symbols-svg/react";
import { ChatBubble } from "@material-symbols-svg/react/icons/chat-bubble";
import { Dashboard } from "@material-symbols-svg/react/icons/dashboard";
import { Layers } from "@material-symbols-svg/react/icons/layers";
import { MenuBook } from "@material-symbols-svg/react/icons/menu-book";
import { School } from "@material-symbols-svg/react/icons/school";
import { Search } from "@material-symbols-svg/react/icons/search";
import type { SvgIconProps } from "@mui/material";
import { Box, ButtonBase, SvgIcon, Typography, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const ROOT_TABS = [
  { label: 'داشبورد', icon: 'dashboard', path: '/dashboard' },
  { label: 'دوره ها', icon: 'school', path: '/' },
  { label: 'لایتنر', icon: 'layers', path: '/leitner-box' },
  { label: 'کتابخانه', icon: 'menu_book', path: '/library' },
  { label: 'جستجو', icon: 'search', path: '/vocab' },
  { label: 'مکالمه', icon: 'chat_bubble', path: '/chat' },
] as const;

const tabs = ROOT_TABS;
const LEITNER_REVIEW_PATH_PREFIX = "/boxlevel/";
const NAV_SYMBOLS = {
  chat_bubble: ChatBubble,
  dashboard: Dashboard,
  layers: Layers,
  menu_book: MenuBook,
  school: School,
  search: Search,
} satisfies Record<string, MaterialSymbolsComponent>;

type BottomNavSymbolProps = Omit<SvgIconProps, "children"> & {
  name: keyof typeof NAV_SYMBOLS;
};

function BottomNavSymbol ({ name, sx, ...props }: BottomNavSymbolProps) {
  const Symbol = NAV_SYMBOLS[name];

  return (
    <SvgIcon
      {...props}
      component={Symbol}
      inheritViewBox
      sx={{
        fontSize: 24,
        fill: "currentColor",
        ...sx,
      }}
    />
  );
}

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
        left: '16px',
        right: '16px',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
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
          px: 0.7,
          py: 0.7,
          borderRadius: '24px',
          backgroundColor: isDark ? 'rgba(40,38,46,0.55)' : 'rgba(255,255,255,0.5)',
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
                flex: 1,
                height: 45,
                maxWidth: 55,
                flexDirection: 'column',
                gap: 0.35,
                borderRadius: '16px',
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
              <BottomNavSymbol
                name={tab.icon}
                sx={{
                  position: 'relative',
                  fontSize: 22,
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  transition: theme.transitions.create(['color', 'opacity'], {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                }}
              />
              <Typography
                noWrap
                sx={{
                  position: 'relative',
                  maxWidth: '100%',
                  fontSize: 9,
                  lineHeight: 1,
                  fontWeight: 500,
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  transition: theme.transitions.create(['color'], {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                }}
              >
                {tab.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
