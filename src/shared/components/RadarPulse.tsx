import { Box } from '@mui/material';

interface RadarPulseProps {
  size?: number;
  offset?: number;
  circles?: number;
}

export function RadarPulse ({ size = 180, offset = 40, circles = 6 }: RadarPulseProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -65,
        left: -90,
        width: size,
        height: size,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: circles }, (_, i) => i).map((delay) => (
        <Box
          key={delay}
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: 'primary.main',
            '@keyframes radarPulse': {
              '0%': { transform: 'scale(0)', opacity: 0.5 },
              '100%': { transform: 'scale(1.0)', opacity: 0 },
            },
            animation: `radarPulse 4.2s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}
