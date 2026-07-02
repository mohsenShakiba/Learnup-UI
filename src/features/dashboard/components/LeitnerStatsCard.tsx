import { keyframes } from '@emotion/react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ActionCard } from '../../../shared/components/ActionCard';

interface Props {
  totalItems: number;
  dueItems: number;
}

const dummyVocabs = ['brave', 'focus', 'review'];

const stackCycle = keyframes`
  0%, 27% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    z-index: 3;
  }

  33% {
    opacity: 0;
    transform: translate(0, 0) scale(1);
    z-index: 3;
  }

  34% {
    opacity: 0;
    transform: translateY(-22px) translateX(-12px) scale(0.84);
    z-index: 1;
  }

  42%, 60% {
    opacity: 1;
    transform: translateY(-22px) translateX(-8px) scale(0.84);
    z-index: 1;
  }

  67%, 93% {
    opacity: 1;
    transform: translateY(-11px) translateX(-4px) scale(0.92);
    z-index: 2;
  }

  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    z-index: 3;
  }
`;

function VocabCardStack () {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        right: 14,
        bottom: 8,
        width: 118,
        height: 78,
        pointerEvents: 'none',
      }}
    >
      {dummyVocabs.map((vocab, index) => (
        <Box
          key={vocab}
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 96,
            minHeight: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            px: 1.25,
            py: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transformOrigin: 'right bottom',
            animation: `${stackCycle} 4.5s ease-in-out infinite`,
            animationDelay: `${index * -1.5}s`,
          }}
        >
          <Typography
            component="span"
            sx={{
              display: 'block',
              direction: 'ltr',
              textAlign: 'center',
              color: 'primary.main',
              textTransform: 'capitalize',
            }}
          >
            {vocab}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export function LeitnerStatsCard ({ totalItems, dueItems }: Props) {

  const navigate = useNavigate();

  const isTotalEmpty = totalItems === 0;

  const actionLabel = isTotalEmpty ? 'آشنایی با لاینتر' : 'بریم مرور کنیم';

  return (
    <ActionCard
      aria-label={actionLabel}
      onClick={() => navigate('/leitner-box')}
      sx={{ overflow: 'hidden', position: 'relative', p: 2 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Stack spacing={0.5} sx={{ flex: 1, alignItems: 'start', minWidth: 0, position: 'relative', zIndex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            جعبه لایتنر
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isTotalEmpty ? actionLabel : `${dueItems} لغت آماده مرور از ${totalItems} لغت`}
          </Typography>
        </Stack>

        <VocabCardStack />
      </Box>
    </ActionCard>
  );
}
