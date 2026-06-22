import {
  Box,
  Divider,
  Drawer,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { FONTS, ReaderConfig, Theme, THEMES } from '../readerTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  config: ReaderConfig;
  onConfigChange: (patch: Partial<ReaderConfig>) => void;
}

export function ReaderConfigDrawer ({ open, onClose, config, onConfigChange }: Props) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', mb: 2 }} />

      <Typography variant="subtitle1">Reader Settings</Typography>

      <Typography variant="caption" color="text.secondary" gutterBottom>
        Theme
      </Typography>
      <Stack direction="row" spacing={1}>
        {(Object.keys(THEMES) as Theme[]).map((t) => (
          <Box
            key={t}
            onClick={() => onConfigChange({ theme: t })}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              border: 2,
              borderColor: config.theme === t ? 'primary.main' : 'divider',
              bgcolor: THEMES[t].bg,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: THEMES[t].color, fontWeight: 600 }}>
              {THEMES[t].label}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="caption" color="text.secondary" gutterBottom>
        Font
      </Typography>
      <Select
        size="small"
        fullWidth
        value={config.fontFamily}
        onChange={(e) => onConfigChange({ fontFamily: e.target.value })}
        sx={{ mb: 3 }}
      >
        {FONTS.map((f) => (
          <MenuItem key={f} value={f} sx={{ fontFamily: f === 'Default' ? 'inherit' : f }}>
            {f}
          </MenuItem>
        ))}
      </Select>

      <Divider sx={{ mb: 3 }} />

      <Stack direction="row">
        <Typography variant="caption" color="text.secondary">
          Font Size
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {config.fontSize}px
        </Typography>
      </Stack>
      <Slider
        min={12}
        max={28}
        step={1}
        value={config.fontSize}
        onChange={(_, v) => onConfigChange({ fontSize: v as number })}
        sx={{ mb: 3 }}
      />

      <Stack direction="row">
        <Typography variant="caption" color="text.secondary">
          Line Spacing
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {config.lineSpacing.toFixed(1)}
        </Typography>
      </Stack>
      <Slider
        min={1.0}
        max={2.5}
        step={0.1}
        value={config.lineSpacing}
        onChange={(_, v) => onConfigChange({ lineSpacing: v as number })}
        sx={{ mb: 3 }}
      />

      <Stack direction="row">
        <Typography variant="caption" color="text.secondary">
          Padding
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {config.padding}px
        </Typography>
      </Stack>
      <Slider
        min={0}
        max={64}
        step={4}
        value={config.padding}
        onChange={(_, v) => onConfigChange({ padding: v as number })}
      />
    </Drawer>
  );
}
