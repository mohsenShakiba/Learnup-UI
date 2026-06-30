import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TypeWriter } from '../../../components/TypeWriter';
import { ActionCard } from '../../../shared/components/ActionCard';

interface Props {
  totalItems: number;
  dueItems: number;
}

export function LeitnerStatsCard({ totalItems, dueItems }: Props) {

  const navigate = useNavigate();

  const isTodayEmpty = dueItems === 0;
  const isTotalEmpty = totalItems === 0;

  const vocabs = isTodayEmpty ? ['you', 'are', 'the', 'best'] : [`${dueItems} due`, `${totalItems} total`]
  const actionLabel = isTotalEmpty ? 'آشنایی با لاینتر' : 'بریم مرور کنیم';

  return (
    <ActionCard
      aria-label={actionLabel}
      onClick={() => navigate('/leitner-box')}
      sx={{ overflow: 'hidden', position: 'relative', p: 2 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 64 }}>
        <Stack spacing={0.5} sx={{ flex: 1, alignItems: 'start', minWidth: 0, position: 'relative', zIndex: 1 }}>
          <Typography variant="body1">
            جعبه لایتنر
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {actionLabel}
          </Typography>
        </Stack>

        <TypeWriter sx={{
          fontSize: '45px',
          opacity: 0.15,
          position: 'absolute',
          direction: 'rtl',
          right: 10,
          bottom: 0
        }}
          words={vocabs} />
      </Box>
    </ActionCard>
  );
}
