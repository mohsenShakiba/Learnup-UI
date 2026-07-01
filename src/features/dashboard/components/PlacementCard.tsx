import { Box, Card, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  placementLevel?: string;
}

export function PlacementCard({ placementLevel }: Props) {
  const navigate = useNavigate();

  const hasLevel = !!placementLevel;

  return (
    <Card
      elevation={0}
      onClick={() => navigate('/placement')}
      role="button"
      tabIndex={0}
      aria-label={hasLevel ? 'مشاهده نتیجه آزمون تعیین سطح' : 'شرکت در آزمون تعیین سطح'}
      sx={{
        p: 3,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        color: '#fff',
        background:
          'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 50%, rgb(124, 58, 237) 100%)',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        '&:active': { transform: 'scale(0.98)', opacity: 0.9 },
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
          <Typography sx={{ fontSize: 20 }}>🎯</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            آزمون تعیین سطح
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {hasLevel ? 'سطح فعلی شما' : 'سطح انگلیسی خود را کشف کنید'}
          </Typography>
        </Stack>

        {/* Level badge */}
        <Box
          sx={{
            flexShrink: 0,
            minWidth: 84,
            height: 84,
            px: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {hasLevel ? (
            <Typography
              sx={{
                fontFamily: 'FredokaOne',
                fontSize: 34,
                lineHeight: 1,
                direction: 'ltr',
                textShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {placementLevel}
            </Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: 28, lineHeight: 1 }}>?</Typography>
              <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.85 }}>
                شروع کنید
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}
