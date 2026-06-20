import { Box, Button, Card, Chip, Divider, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GlowOrbs } from '../../../shared/components/GlowOrbs';
import FormatNumber from '../../../utils/NumberFmt';

interface Props {
  totalItems: number;
  dueItems: number;
}

export function LeitnerStatsCard({ totalItems, dueItems }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      onClick={() => navigate('/leitner-box')}
    >
      <GlowOrbs />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>

        <Stack spacing={1} sx={{ flex: 1, alignItems: 'start' }}>
          <Typography variant="body1" >
            جعبه لایتنر
          </Typography>
          <Button size='small' endIcon={<Icon>arrow_backward</Icon>} sx={{ bgcolor: 'common.black' }}>مرور لغات امروز</Button>
        </Stack>
        <Stack direction="row" spacing={0.5}  >
          <Typography variant='caption' sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 1,
            py: 2,
          }}>
            {`${FormatNumber(dueItems)} آماده مرور`}
          </Typography>
          <Divider />
          <Typography variant='caption'>
            {`${FormatNumber(totalItems)} کلمه کل`}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
