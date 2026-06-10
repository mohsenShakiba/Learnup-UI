import { Box, Paper } from '@mui/material';
import { useId, useMemo, type ReactNode } from 'react';

type SuperFancyComponentProps = {
  /** Same seed always produces the same shape positions, rotations and colors. */
  seed?: string | number;
  children?: ReactNode;
};

type GradientPair = readonly [string, string];

const PALETTE: readonly GradientPair[] = [
  ['#FF6B6B', '#C44569'],
  ['#4ECDC4', '#1B9AAA'],
  ['#9B59B6', '#5F27CD'],
  ['#F39C12', '#E74C3C'],
  ['#54A0FF', '#2E86DE'],
  ['#1DD1A1', '#10AC84'],
  ['#FECA57', '#FF9F43'],
];

/** Hash an arbitrary string into a 32-bit integer (xmur3 finalizer). */
function hashSeed (seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Deterministic PRNG (mulberry32) — returns floats in [0, 1). */
function mulberry32 (a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildShapeParams (seed: string | number) {
  const rng = mulberry32(hashSeed(String(seed)));
  const range = (min: number, max: number) => min + rng() * (max - min);
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(rng() * items.length)];

  return {
    rect: {
      top: range(-135, -85),
      left: range(-135, -85),
      rotate: range(-45, 45),
      colors: pick(PALETTE),
    },
    ring: {
      top: range(-155, -105),
      right: range(-145, -95),
      rotate: 0,
      color: pick(PALETTE)[0],
    },
    circle: {
      top: `${range(25, 55)}%`,
      right: range(-225, -175),
      colors: pick(PALETTE),
    },
    cloud: {
      bottom: range(-145, -100),
      left: range(-160, -60),
      rotate: range(-12, 12),
      colors: pick(PALETTE),
    },
  };
}

export function SuperFancyComponent ({ seed = 'default', children }: SuperFancyComponentProps) {
  const uid = useId();
  const { rect, ring, circle, cloud } = useMemo(() => buildShapeParams(seed), [seed]);

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: '#1a1a2e',
      }}
    >
      {/* Top-left: rounded rectangle, tilted so one soft corner dips into the card */}
      <svg
        viewBox="0 0 200 200"
        style={{ position: 'absolute', top: rect.top, left: rect.left, width: 230, height: 230, opacity: 0.1 }}
      >
        <defs>
          <linearGradient id={`${uid}-rect`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={rect.colors[0]} />
            <stop offset="100%" stopColor={rect.colors[1]} />
          </linearGradient>
        </defs>
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx="48"
          fill={`url(#${uid}-rect)`}
          transform={`rotate(${rect.rotate} 100 100)`}
        />
      </svg>

      {/* Top-right: thin ring, just a curved arc dips into the corner */}
      <svg
        viewBox="0 0 220 220"
        style={{ position: 'absolute', top: ring.top, right: ring.right, width: 220, height: 220, opacity: 0.1 }}
      >
        <circle
          cx="110"
          cy="110"
          r="92"
          fill="none"
          stroke={ring.color}
          strokeWidth="22"
          opacity="0.9"
        />
      </svg>

      {/* Right edge: circle peeking in from the side */}
      <svg
        viewBox="0 0 260 260"
        style={{ position: 'absolute', top: circle.top, right: circle.right, width: 260, height: 260, opacity: 0.1 }}
      >
        <defs>
          <linearGradient id={`${uid}-circle`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={circle.colors[0]} />
            <stop offset="100%" stopColor={circle.colors[1]} />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r="126" fill={`url(#${uid}-circle)`} />
      </svg>

      {/* Bottom-left: cloud shape, only its bumpy top edge rises into the card */}
      <svg
        viewBox="0 0 320 200"
        style={{
          position: 'absolute',
          bottom: cloud.bottom,
          left: cloud.left,
          width: 320,
          height: 200,
          opacity: 0.1,
          transform: `rotate(${cloud.rotate}deg)`,
        }}
      >
        <defs>
          <linearGradient id={`${uid}-cloud`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cloud.colors[0]} />
            <stop offset="100%" stopColor={cloud.colors[1]} />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${uid}-cloud)`}
          opacity="0.85"
          d="
            M 0,200 L 0,110
            C 0,52 44,12 104,12
            C 136,12 162,26 178,50
            C 186,64 196,66 204,58
            C 216,42 234,34 252,36
            C 286,40 306,68 306,104
            C 314,112 320,124 320,140
            L 320,200 Z
          "
        />
      </svg>

      {/* Card content sits above the shapes */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
