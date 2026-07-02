import { Stack, Typography } from '@mui/material';
import { AppIcon } from './AppIcon';

type Props = {
    minutes: number | string;
    unit?: 'minute' | 'hour';
};

export function DurationBadge({ minutes, unit = 'minute' }: Props) {
    return (
        <Stack direction='row' sx={{ alignItems: 'center', opacity: 0.4, gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.8rem', fontFamily: 'arial', direction: 'rtl' }}>
                {minutes} {unit === 'minute' ? 'Min' : unit === 'hour' ? 'Hours' : 'Days'}
            </Typography>
            <AppIcon sx={{ fontSize: '1.2rem' }}>timer</AppIcon>
        </Stack>
    );
}
