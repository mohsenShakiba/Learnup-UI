import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ActionCard } from '../../../shared/components/ActionCard';

interface Props {
  placementLevel?: string;
}

export function PlacementCard ({ placementLevel }: Props) {
  const navigate = useNavigate();

  const hasLevel = !!placementLevel;

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
      {/* Decorative rings */}
      <Box
        sx={{
          position: 'absolute',
          top: -70,
          left: -70,
          width: 180,
          height: 180,
          borderRadius: '50%',
          border: '24px solid rgba(255,255,255,0.08)',
        }}
      />

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
          sx={{
            px: 1.5,
            borderRadius: 1,
            width: 70,
            height: 45,
            textAlign: 'center',
            lineHeight: '45px',
            bgcolor: '#f5a142',
            color: 'common.white',
            fontFamily: 'FredokaOne',
            fontSize: 34,
          }}
        >
          {placementLevel}
        </Box>
      </Box>
    </ActionCard>
  );
}
