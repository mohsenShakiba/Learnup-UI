import type { SxProps, Theme } from '@mui/material';
import { Box, Stack } from '@mui/material';

type DottedProgressProps = {
  value: number;
  dotCount?: number;
  sx?: SxProps<Theme>;
};

export function DottedProgress ({ value, dotCount = 25, sx }: DottedProgressProps) {

  const clamped = Math.min(100, Math.max(0, value));
  const filledCount = Math.round((clamped / 100) * dotCount);

  return (
    <Stack
      direction='row'
      role='progressbar'
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={[
        {
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {Array.from({ length: dotCount }, (_, index) => {
        const filled = index < filledCount;
        return (
          <Box
            key={index}
            sx={(theme) => ({
              width: '5px',
              height: '5px',
              borderRadius: 3,
              backgroundColor: filled ? theme.palette.success.main : 'rgba(255,255,255,0.25)',
              boxShadow: filled ? `0 0 6px ${theme.palette.success.main}` : 'none',
              transition: theme.transitions.create(['background-color', 'box-shadow'], {
                duration: theme.transitions.duration.standard,
              }),
            })}
          />
        );
      })}
    </Stack>
  );
}
