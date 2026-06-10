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
      {/* Top-left: Camel-back — two humps silhouette */}
      <svg
        viewBox="0 0 300 200"
        style={{ position: 'absolute', top: -20, left: -20, width: 300, height: 200, overflow: 'visible' }}
      >
        <path
          fill="#FF6B6B"
          d="
            M 0,200 L 0,125
            C 8,100 22,72 52,60
            C 72,52 86,58 98,72
            C 110,86 115,106 132,106
            C 149,106 156,84 172,70
            C 188,56 210,52 238,60
            C 262,68 278,96 285,125
            L 285,200 Z
          "
        />
      </svg>

      {/* Top-right: Crescent moon */}
      <svg
        viewBox="0 0 180 220"
        style={{ position: 'absolute', top: -60, right: -55, width: 180, height: 220, overflow: 'visible' }}
      >
        <path
          fill="#4ECDC4"
          d="
            M 138,12
            C 180,38 196,108 174,164
            C 152,220 106,242 68,225
            C 104,204 128,168 132,124
            C 136,80 120,38 138,12 Z
          "
        />
      </svg>

      {/* Bottom-left: Starfish — 5 organic arms */}
      <svg
        viewBox="0 0 200 200"
        style={{ position: 'absolute', bottom: -88, left: -88, width: 210, height: 210, overflow: 'visible' }}
      >
        <path
          fill="#9B59B6"
          d="
            M 100,12
            C 116,6 134,24 131,50
            C 154,32 178,30 186,48
            C 175,68 154,76 136,68
            C 150,94 154,124 138,136
            C 120,122 105,112 100,116
            C 95,112 80,122 62,136
            C 46,124 50,94 64,68
            C 46,76 25,68 14,48
            C 22,30 46,32 69,50
            C 66,24 84,6 100,12 Z
          "
        />
      </svg>

      {/* Bottom-right: Spiked asymmetric star */}
      <svg
        viewBox="0 0 200 200"
        style={{ position: 'absolute', bottom: -78, right: -78, width: 210, height: 210, overflow: 'visible' }}
      >
        <path
          fill="#F39C12"
          d="
            M 100,14
            C 126,4 162,24 176,58
            C 196,40 206,8 200,0
            C 196,36 186,62 184,88
            C 208,102 212,140 196,158
            C 172,146 150,162 146,186
            C 126,170 110,182 100,186
            C 90,182 74,170 54,186
            C 50,162 28,146 4,158
            C -12,140 -8,102 16,88
            C 14,62 4,36 0,0
            C -6,8 4,40 24,58
            C 38,24 74,4 100,14 Z
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
