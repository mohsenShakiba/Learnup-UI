import type { SxProps, Theme } from '@mui/material';
import { Box, Stack } from '@mui/material';

type Props = {
    columns?: number;
    dotSize?: number;
    spacing?: number;
    color?: string;
    sx?: SxProps<Theme>;
};

export function DottedDivider ({ columns = 10, dotSize = 3, spacing = 1, color = 'divider', sx }: Props) {
    return (
        <Stack spacing={spacing} sx={{ alignItems: 'center', ...sx }}>
            {[0, 1].map(row => (
                <Stack key={row} direction='row' spacing={spacing}>
                    {Array.from({ length: columns }, (_, col) => (
                        <Box
                            key={col}
                            sx={{
                                width: dotSize,
                                height: dotSize,
                                borderRadius: '50%',
                                bgcolor: color,
                            }}
                        />
                    ))}
                </Stack>
            ))}
        </Stack>
    );
}
