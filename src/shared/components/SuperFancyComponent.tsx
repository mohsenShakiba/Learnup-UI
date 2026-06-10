import { Box, Paper } from '@mui/material';
import type { ReactNode } from 'react';

type SuperFancyComponentProps = {
  children?: ReactNode;
};

export function SuperFancyComponent ({ children }: SuperFancyComponentProps) {
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
        style={{ position: 'absolute', top: -110, left: -110, width: 230, height: 230, opacity: 0.1 }}
      >
        <defs>
          <linearGradient id="sfc-rect-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#C44569" />
          </linearGradient>
        </defs>
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx="48"
          fill="url(#sfc-rect-1)"
          transform="rotate(-18 100 100)"
        />
      </svg>

      {/* Top-right: thin ring, just a curved arc dips into the corner */}
      <svg
        viewBox="0 0 220 220"
        style={{ position: 'absolute', top: -130, right: -120, width: 220, height: 220, opacity: 0.1 }}
      >
        <circle
          cx="110"
          cy="110"
          r="92"
          fill="none"
          stroke="#4ECDC4"
          strokeWidth="22"
          opacity="0.9"
        />
      </svg>

      {/* Right edge: circle peeking in from the side */}
      <svg
        viewBox="0 0 260 260"
        style={{ position: 'absolute', top: '38%', right: -200, width: 260, height: 260, opacity: 0.1 }}
      >
        <defs>
          <linearGradient id="sfc-circle-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9B59B6" />
            <stop offset="100%" stopColor="#5F27CD" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r="126" fill="url(#sfc-circle-2)" />
      </svg>

      {/* Bottom-left: cloud shape, only its bumpy top edge rises into the card */}
      <svg
        viewBox="0 0 320 200"
        style={{ position: 'absolute', bottom: -120, left: -110, width: 320, height: 200, opacity: 0.1 }}
      >
        <defs>
          <linearGradient id="sfc-cloud-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F39C12" />
            <stop offset="100%" stopColor="#E74C3C" />
          </linearGradient>
        </defs>
        <path
          fill="url(#sfc-cloud-1)"
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
