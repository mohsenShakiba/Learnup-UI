import { Button, type ButtonProps } from '@mui/material';

export function FancyButton({ sx, children, ...props }: ButtonProps) {
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
          background: `linear-gradient(0deg, #3458eb, #3458eb)`,
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
            animation: 'fancyButtonShine 1.5s ease-in-out infinite',
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
