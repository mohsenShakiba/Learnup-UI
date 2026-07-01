import { keyframes } from '@emotion/react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ActionCard } from '../../../shared/components/ActionCard';

interface Props {
  placementLevel?: string;
}

type LevelTone = {
  bg: string;
};

const badgeShine = keyframes`
  0% {
    transform: translateX(-200%) skewX(-18deg);
  }
  45%, 100% {
    transform: translateX(500%) skewX(-18deg);
  }
`;

const LEVEL_TONES: Record<string, LevelTone> = {
  A1: {
    bg: '#10b981',
  },
  A2: {
    bg: '#14b8a6',
  },
  B1: {
    bg: '#0ea5e9',
  },
  B2: {
    bg: '#3458eb',
  },
  C1: {
    bg: '#7c3aed',
  },
  C2: {
    bg: '#8b5cf6',
  },
};

const DEFAULT_TONE: LevelTone = {
  bg: '#64748b',
};

function getLevelTone (level?: string) {
  return LEVEL_TONES[level?.trim().toUpperCase() ?? ''] ?? DEFAULT_TONE;
}

export function PlacementCard ({ placementLevel }: Props) {
  const navigate = useNavigate();

  const hasLevel = !!placementLevel;
  const tone = getLevelTone(placementLevel);

  return (
    <ActionCard
      onClick={() => navigate('/placement')}
      sx={{
        p: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            آزمون تعیین سطح
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {hasLevel ? 'سطح فعلی شما' : 'سطح انگلیسی خود را کشف کنید'}
          </Typography>
        </Stack>

        {/* Level badge */}
        <Box
          className="placement-level-badge"
          sx={{
            position: 'relative',
            flex: '0 0 auto',
            width: 70,
            height: 45,
            borderRadius: 1.5,
            textAlign: 'center',
            lineHeight: '45px',
            background: tone.bg,
            color: 'common.white',
            fontFamily: 'FredokaOne',
            fontSize: hasLevel ? 34 : 24,
            letterSpacing: 0,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -8,
              bottom: -8,
              left: 0,
              width: 28,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.58), transparent)',
              animation: `${badgeShine} 2.8s ease-in-out infinite`,
              pointerEvents: 'none',
            },
          }}
        >
          {hasLevel ? placementLevel : '?'}
        </Box>
      </Box>
    </ActionCard>
  );
}
