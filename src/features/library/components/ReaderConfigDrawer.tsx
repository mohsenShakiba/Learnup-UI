import {
  Box,
  Button,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';
import { FONT_SIZES, ReaderConfig } from '../readerTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  config: ReaderConfig;
  onConfigChange: (patch: Partial<ReaderConfig>) => void;
}

export function ReaderConfigDrawer ({ open, onClose, config, onConfigChange }: Props) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', my: 2 }} />

      <Box sx={{ px: 2, pb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Reader Settings
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Font Size
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {FONT_SIZES.map((size) => (
            <Button
              key={size}
              fullWidth
              variant={config.fontSize === size ? 'contained' : 'outlined'}
              onClick={() => onConfigChange({ fontSize: size })}
            >
              {size}
            </Button>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
