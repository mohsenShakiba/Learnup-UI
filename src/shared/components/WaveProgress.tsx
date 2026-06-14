import type { SxProps, Theme } from '@mui/material';
import { alpha, Box, keyframes } from '@mui/material';

type WaveProgressProps = {
  value: number;
  size?: number;
  sx?: SxProps<Theme>;
};

const wave = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export function WaveProgress ({ value, size = 64, sx }: WaveProgressProps) {

  const clamped = Math.min(100, Math.max(0, value));
  // Fill level rises from the bottom as value increases.
  const fillTop = 100 - clamped;

  return (
    <Box
      role='progressbar'
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={[
        (theme) => ({
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(0,0,0,0.02)',
          flexShrink: 0,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* The water body, positioned so its top edge sits at the fill level. */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: `${fillTop}%`,
          backgroundColor: alpha(theme.palette.success.main, 1),
          transition: theme.transitions.create('top', {
            duration: theme.transitions.duration.standard,
          }),
        })}
      >
        {/* Animated wavy top edge, drawn as a repeating SVG strip twice the
            circle's width so it can scroll left and loop seamlessly. The
            vertical lift is done with `top` (not transform) so it doesn't get
            clobbered by the translateX animation. */}
        <Box
          component='svg'
          viewBox='0 0 200 20'
          preserveAspectRatio='none'
          sx={(theme) => ({
            position: 'absolute',
            bottom: `7px`,
            left: 0,
            width: '200%',
            height: 5,
            color: alpha(theme.palette.success.main, 1),
            animation: `${wave} 2s linear infinite`,
          })}
        >
          <path
            fill='currentColor'
            d='M0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 20 H 0 Z'
          />
        </Box>
      </Box>
    </Box>
  );
}
