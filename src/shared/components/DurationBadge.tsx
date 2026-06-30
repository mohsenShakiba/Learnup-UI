import { Icon, Stack, Typography } from '@mui/material';

type Props = {
    minutes: number | string;
};

export function DurationBadge ({ minutes }: Props) {
    return (
        <Stack direction='row' sx={{ alignItems: 'center', opacity: 0.4, gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.8rem', fontFamily: 'arial', direction: 'rtl' }}>
                {minutes} Min
            </Typography>
            <Icon sx={{ fontSize: '1.2rem' }}>timer</Icon>
        </Stack>
    );
}
