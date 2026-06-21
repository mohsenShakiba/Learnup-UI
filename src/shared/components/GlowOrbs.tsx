import { Box } from '@mui/material';

interface Orb {
  size: number;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  delay?: number;
  opacity?: number;
}

interface GlowOrbsProps {
  orbs?: Orb[];
  color?: string;
}

const DEFAULT_ORBS: Orb[] = [
  { size: 140, top: -40, right: -40, delay: 0, opacity: 0.22 },
  { size: 90,  bottom: -25, left: -25, delay: 1.8, opacity: 0.16 },
];

export function GlowOrbs ({ orbs = DEFAULT_ORBS, color = 'rgba(255,255,255,1)' }: GlowOrbsProps) {
  return (
    <>
      {orbs.map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            borderRadius: '50%',
            background: color,
            opacity: orb.opacity ?? 0.15,
            filter: `blur(${Math.round(orb.size * 0.35)}px)`,
            pointerEvents: 'none',
            '@keyframes glowOrbFloat': {
              '0%, 100%': { transform: 'translateY(0px) scale(1)' },
              '50%':       { transform: 'translateY(-10px) scale(1.08)' },
            },
            animation: `glowOrbFloat ${3.5 + i * 0.8}s ease-in-out ${orb.delay ?? 0}s infinite`,
          }}
        />
      ))}
    </>
  );
}
