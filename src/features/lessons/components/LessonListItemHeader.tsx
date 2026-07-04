import { Box, Divider, Stack, Typography } from '@mui/material';
import { AppIcon } from '../../../shared/components/AppIcon';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type LessonListItemHeaderProps = {
    icon: string;
    label: string;
    durationMinutes: number | null | undefined;
};

export function LessonListItemHeader ({
    icon,
    label,
    durationMinutes,
}: LessonListItemHeaderProps) {
    return (
        <Stack spacing={1} >
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', direction: 'rtl' }}>
                <Stack
                    direction='row'
                    sx={{
                        gap: 1,
                        alignItems: 'center',
                        color: 'primary.main',
                    }}
                >
                    <AppIcon>{icon}</AppIcon>
                    <Typography>{label}</Typography>
                </Stack>
                <Box sx={{ flex: 1 }} />
                <DurationBadge minutes={durationMinutes ?? 0} />
            </Stack>

            <Divider />
        </Stack>
    );
}
