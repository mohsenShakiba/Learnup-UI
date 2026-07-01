import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { PlacementResultResponse } from '../../../api/Learnup/models/PlacementResultResponse';
import { FancyButton } from '../../../shared/components/FancyButton';
import { ResultCard } from '../../../shared/components/ResultCard';
import ConfettiOverlay from '../../VocabTests/components/ConfettiOverlay';

type Props = {
  result: PlacementResultResponse;
  onRetake: () => void;
};

export default function PlacementResult ({ result, onRetake }: Props) {
  const navigate = useNavigate();

  const bands = Object.entries(result.correctByBand);

  const handleStart = () => {
    if (result.startingCourseId != null) {
      navigate(`/courses/${result.startingCourseId}`);
    } else {
      // No suggested course — fall back to the courses list rather than a dead-end.
      navigate('/');
    }
  };

  return (
    <Stack
      sx={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <ConfettiOverlay />

      <ResultCard
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
        }}
        icon="🎯"
        iconLabel="target"
      >
        <Stack direction="column" spacing={2}>

          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            سطح شما
          </Typography>

          <Typography variant="h1" sx={{ lineHeight: 1, direction: 'ltr' }}>
            {result.placedLevel}
          </Typography>

          {bands.length > 0 && (
            <Stack spacing={0.5} sx={{ direction: 'ltr' }}>
              {bands.map(([band, correct]) => (
                <Stack key={band} direction="row" sx={{ gap: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', direction: 'ltr' }}>
                    {band}:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', direction: 'ltr' }}>
                    {correct} جواب صحیح
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}

          <Box sx={{ pt: 1 }}>
            <FancyButton fullWidth onClick={handleStart} sx={{ borderRadius: 999 }}>
              شروع یادگیری
            </FancyButton>
          </Box>

          <Button variant="outlined" onClick={onRetake} sx={{ borderRadius: 999 }}>
            شرکت مجدد
          </Button>

        </Stack>
      </ResultCard>
    </Stack>
  );
}
