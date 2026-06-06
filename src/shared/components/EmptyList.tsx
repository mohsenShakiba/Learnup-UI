import { Box, Typography } from '@mui/material';

type EmptyListProps = {
  message?: string;
};

export function EmptyList ({ message }: EmptyListProps) {
  return (
    <Box
      sx={{
        width: '100%',
        px: 2,
        py: 3,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        boxSizing: 'border-box',
        color: 'text.secondary',
      }}
    >
      <Typography component="p" variant="body2">
        {message ?? 'موردی یافت نشد!'}
      </Typography>
    </Box>
  );
}
