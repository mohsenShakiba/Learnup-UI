import { Card, type CardProps } from '@mui/material';

export function FancyCard ({ sx, children, ...props }: CardProps) {
  return (
    <Card
      {...props}
      sx={[
        (theme) => ({
          '@keyframes fancyCardGradient': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
          position: 'relative',
          overflow: 'hidden',
          border: 0,
          p: '2px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
          transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '160%',
            aspectRatio: '1 / 1',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            transformOrigin: '0 0',
            pointerEvents: 'none',
            background:
              'conic-gradient(from 0deg, #2563eb, #14b8a6, #f59e0b, #db2777, #7c3aed, #2563eb)',
            animation: 'fancyCardGradient 4s linear infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 2,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            backgroundColor: theme.palette.background.paper,
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
          '@media (prefers-reduced-motion: reduce)': {
            '&::before': {
              animation: 'none',
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Card>
  );
}
