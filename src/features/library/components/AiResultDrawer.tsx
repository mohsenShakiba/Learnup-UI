import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  SwipeableDrawer,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  sentence: string;
  loading: boolean;
  error: boolean;
  result: string | null;
}

export function AiResultDrawer ({ open, onOpen, onClose, sentence, loading, error, result }: Props) {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '70vh',
        },
      }}
    >
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', my: 1.5 }} />

      <Box sx={{ px: 2, pb: 3, overflowY: 'auto' }}>
        {sentence && (
          <>
            <Typography variant="caption" color="text.secondary">
              Selected sentence
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              {sentence}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {loading && (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              در حال دریافت پاسخ…
            </Typography>
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error">
            خطا در دریافت پاسخ. لطفاً دوباره تلاش کنید.
          </Typography>
        )}

        {!loading && !error && result != null && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {result}
          </Typography>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
