import { Box, Button, Card, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GlowOrbs } from '../../../shared/components/GlowOrbs';
import FormatNumber from '../../../utils/NumberFmt';
import { TypeWriter } from '../../../components/TypeWriter';

interface Props {
  totalItems: number;
  dueItems: number;
}

export function LeitnerStatsCard({ totalItems, dueItems }: Props) {

  const navigate = useNavigate();

  const isTodayEmpty = dueItems === 0;
  const isTotalEmpty = totalItems === 0;

  return (
    <Card sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

        <TypeWriter sx={{
          fontSize: '30px',
          opacity: 0.15,
          position: 'absolute',
          direction: 'rtl',
          right: 10,
          bottom: 8
        }}

          words={[`${dueItems} due`, `${totalItems} total`]} />
      </Box>
    </Card>
  );
}
