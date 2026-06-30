import { Box, Divider, Icon, Stack, Typography } from '@mui/material';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type LessonListItemHeaderProps = {
    icon: string;
    label: string;
    durationMinutes: number | null | undefined;
    color?: string;
};

export function LessonListItemHeader ({
    icon,
    label,
    durationMinutes,
    color = 'primary.main',
}: LessonListItemHeaderProps) {
    return (
        <Stack spacing={1} >
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', direction: 'rtl' }}>
                <Stack
                    direction='row'
                    sx={{
                        gap: 1,
                        alignItems: 'center',
                        color,
                    }}
                >
                    <Icon>{icon}</Icon>
                    <Typography>{label}</Typography>
                </Stack>
                <Box sx={{ flex: 1 }} />
                <DurationBadge minutes={durationMinutes ?? 0} />
            </Stack>

            <Divider />
        </Stack>
    );
}
