import { Icon, Stack, Typography } from '@mui/material';

type Props = {
    minutes: number;
};

export function DurationBadge ({ minutes }: Props) {
    return (
        <Stack direction='row' sx={{ alignItems: 'center', opacity: 0.4, gap: 0.5 }}>
            <Icon sx={{ fontSize: '0.8rem' }}>timer</Icon>
            <Typography sx={{ fontSize: '0.7rem', fontFamily: 'arial' }}>
                {minutes} MIN
            </Typography>
        </Stack>
    );
}
