import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  FONT_SIZES,
  LINE_HEIGHTS,
  READER_FONTS,
  READER_THEMES,
  ReaderConfig,
  TEXT_ALIGNMENTS,
  TEXT_JUSTIFY,
} from '../readerTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  config: ReaderConfig;
  onConfigChange: (patch: Partial<ReaderConfig>) => void;
}

interface OptionGroupProps<T> {
  label: string;
  options: { key: string; label: string; value: T; }[];
  selected: T;
  onSelect: (value: T) => void;
}

function OptionGroup<T> ({ label, options, selected, onSelect }: OptionGroupProps<T>) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" sx={{ mt: 1, gap: 1, flexWrap: 'wrap' }}>
        {options.map((option) => (
          <Button
            key={option.key}
            variant={selected === option.value ? 'contained' : 'outlined'}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

export function ReaderConfigDrawer ({ open, onClose, config, onConfigChange }: Props) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', my: 2 }} />

      <Box sx={{ px: 2, pb: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1">
            Reader Settings
          </Typography>
          <IconButton aria-label="Close" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <OptionGroup
          label="Font Size"
          options={FONT_SIZES.map((size) => ({ key: String(size), label: String(size), value: size }))}
          selected={config.fontSize}
          onSelect={(fontSize) => onConfigChange({ fontSize })}
        />

        <OptionGroup
          label="Font"
          options={READER_FONTS.map((font) => ({ key: font.key, label: font.label, value: font.stack }))}
          selected={config.fontFamily}
          onSelect={(fontFamily) => onConfigChange({ fontFamily })}
        />

        <OptionGroup
          label="Theme"
          options={READER_THEMES.map((theme) => ({ key: theme.key, label: theme.label, value: theme.key }))}
          selected={config.theme}
          onSelect={(theme) => onConfigChange({ theme })}
        />

        <OptionGroup
          label="Text Alignment"
          options={TEXT_ALIGNMENTS.map((align) => ({ key: align.key, label: align.label, value: align.key }))}
          selected={config.textAlign}
          onSelect={(textAlign) => onConfigChange({ textAlign })}
        />

        {config.textAlign === 'justify' && (
          <OptionGroup
            label="Text Justification"
            options={TEXT_JUSTIFY.map((tj) => ({ key: tj.key, label: tj.label, value: tj.key }))}
            selected={config.textJustify}
            onSelect={(textJustify) => onConfigChange({ textJustify })}
          />
        )}

        <OptionGroup
          label="Line Height"
          options={LINE_HEIGHTS.map((lh) => ({ key: String(lh), label: lh.toFixed(1), value: lh }))}
          selected={config.lineHeight}
          onSelect={(lineHeight) => onConfigChange({ lineHeight })}
        />
      </Box>
    </Drawer>
  );
}
