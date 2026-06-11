import { Button, type ButtonProps } from '@mui/material';

export function FancyButton ({ sx, children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      sx={[
        (theme) => ({
          '@keyframes fancyButtonGradient': {
            '0%': {
              backgroundPosition: '0% 20%',
            },
            '50%': {
              backgroundPosition: '0% 30%',
            },
            '100%': {
              backgroundPosition: '0% 40%',
            },
          },
          '@keyframes fancyButtonShine': {
            '0%': {
              left: '-80%',
            },
            '60%': {
              left: '120%',
            },
            '100%': {
              left: '120%',
            },
          },
          position: 'relative',
          overflow: 'hidden',
          color: theme.palette.primary.contrastText,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          backgroundSize: '200% 200%',
          animation: 'fancyButtonGradient 5s ease infinite',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-80%',
            width: '50%',
            height: '100%',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            animation: 'fancyButtonShine 2.8s ease-in-out infinite',
          },
          '&:hover': {
            boxShadow: '0 6px 26px rgba(96, 165, 250, 0.55)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(1px) scale(0.98)',
            boxShadow: '0 2px 10px rgba(96, 165, 250, 0.35)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            '&::before': {
              animation: 'none',
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Button>
  );
}
