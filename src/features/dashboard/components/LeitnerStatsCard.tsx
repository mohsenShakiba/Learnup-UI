import { Box, Button, Card, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GlowOrbs } from '../../../shared/components/GlowOrbs';
import FormatNumber from '../../../utils/NumberFmt';

interface Props {
  totalItems: number;
  dueItems: number;
}

function CardStack({ count }: { count: number }) {
  return (
    <Box sx={{ position: 'relative', width: 70, height: 70 }}>
      {/* Back cards */}
      <Box sx={{
        position: 'absolute', inset: 0,
        bgcolor: 'primary.dark',
        borderRadius: 2,
        transform: 'rotate(-15deg) translateY(4px)',
        opacity: 0.4,
      }} />
      <Box sx={{
        position: 'absolute', inset: 0,
        bgcolor: 'primary.dark',
        borderRadius: 2,
        transform: 'rotate(-10deg) translateY(2px)',
        opacity: 0.65,
      }} />
      {/* Front card */}
      <Box sx={{
        position: 'absolute', inset: 0,
        bgcolor: 'primary.main',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        boxShadow: 3,
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>
          {FormatNumber(count)} کلمه
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85, textAlign: 'center', lineHeight: 1.2, color: 'primary.contrastText' }}>
          آماده مرور
        </Typography>
      </Box>
    </Box>
  );
}

export function LeitnerStatsCard({ totalItems, dueItems }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <GlowOrbs />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
        <Stack spacing={1} sx={{ flex: 1, alignItems: 'start' }}>
          <Typography variant="body1">
            جعبه لایتنر
          </Typography>

          <Button
            endIcon={<Icon>arrow_backward</Icon>}
            onClick={() => navigate('/leitner-box')}
            sx={{ bgcolor: 'common.black' }}
          >
            مرور لغات امروز
          </Button>
        </Stack>
        <CardStack count={dueItems} />
      </Box>
    </Card>
  );
}
