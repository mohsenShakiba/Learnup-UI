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
        {/* Animated wavy surface, drawn as a repeating SVG strip twice the
            circle's width so it can scroll left and loop seamlessly. It sits
            at the top edge of the water body and is lifted by half its height
            (via `top`, not transform, so the translateX animation isn't
            clobbered) so the crests poke above the fill line while the SVG's
            filled lower half blends into the solid water below. */}
        <Box
          component='svg'
          viewBox='0 0 200 20'
          preserveAspectRatio='none'
          sx={(theme) => ({
            position: 'absolute',
            top: -10,
            left: 0,
            width: '200%',
            height: 10,
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
