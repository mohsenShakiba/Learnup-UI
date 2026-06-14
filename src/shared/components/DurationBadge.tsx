import { Icon, Stack, Typography } from '@mui/material';

type Props = {
    minutes: number;
};

export function DurationBadge ({ minutes }: Props) {
    return (
        <Stack direction='row' spacing={0.2} sx={{ alignItems: 'center', opacity: 0.4 }}>
            <Icon sx={{ fontSize: '0.8rem' }}>timer</Icon>
            <Typography sx={{ fontSize: '0.7rem', fontFamily: 'arial' }}>
                {minutes} دقیقه
            </Typography>
        </Stack>
    );
}
