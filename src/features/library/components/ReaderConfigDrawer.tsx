import {
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  FONT_SIZES,
  READER_FONTS,
  ReaderConfig
} from '../../../services/readerTypes';

interface Props {
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

export function ReaderConfigDrawer ({ config, onConfigChange }: Props) {
  const [draftConfig, setDraftConfig] = useState(config);

  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  const updateConfig = (patch: Partial<ReaderConfig>) => {
    setDraftConfig((current) => ({ ...current, ...patch }));
    onConfigChange(patch);
  };

  return (
    <Box>

      <Box sx={{ px: 2, pb: 3 }}>
        <OptionGroup
          label="Font Size"
          options={FONT_SIZES.map((size) => ({ key: String(size), label: String(size), value: size }))}
          selected={draftConfig.fontSize}
          onSelect={(fontSize) => updateConfig({ fontSize })}
        />

        <OptionGroup
          label="Font"
          options={READER_FONTS.map((font) => ({ key: font.key, label: font.key, value: font.key }))}
          selected={draftConfig.fontFamily}
          onSelect={(fontFamily) => updateConfig({ fontFamily })}
        />

      </Box>
    </Box>
  );
}
