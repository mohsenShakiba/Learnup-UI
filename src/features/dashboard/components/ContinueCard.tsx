import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, Stack, Typography } from '@mui/material';
import { FancyButton } from '../../../shared/components/FancyButton';
import { RadarPulse } from '../../../shared/components/RadarPulse';


export function ContinueCard () {

  return (
    <Card
      elevation={0}
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >

      <RadarPulse />

      <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>

        {/* Lesson info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              fontSize: 26,
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
          >
            📖
          </Box>

          <Stack>
            <Typography
              variant="body1"
              sx={{}}
            >
              درس 5
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >
              A walk in the park
            </Typography>
          </Stack>

        </Box>

        {/* CTA */}
        <FancyButton
          fullWidth
          variant="contained"
          endIcon={<ArrowBackIcon />}>
          ادامه درس
        </FancyButton>

      </Stack>
    </Card>
  );
}
