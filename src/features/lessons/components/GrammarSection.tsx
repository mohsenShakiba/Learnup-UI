import { Box, Card, Divider, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { GrammarResponse } from '../../../api/Learnup/models/GrammarResponse';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type Props = {
    grammars: Array<GrammarResponse>;
    lessonId: number;
};

const rowSx = {
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
    '&:active': { opacity: 0.7 },
    p: 1.5,
};

export function GrammarSection ({ grammars, lessonId }: Props) {
    const navigate = useNavigate();
    if (!grammars.length) return null;

    return (
        <Card elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            {grammars.map((grammar) => (
                <Box key={grammar.id}>
                    <Stack spacing={1} sx={rowSx} onClick={() => navigate(`/grammars/${grammar.id}`)}>
                        <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>{grammar.name}</Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{grammar.description}</Typography>
                        <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                            <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', px: 0.8, py: 0.4, fontSize: '0.7rem', bgcolor: 'warning.main', borderRadius: 1, color: 'white' }}>
                                <Icon sx={{ fontSize: '0.8rem' }}>hourglass_empty</Icon>
                                <Box>در انتظار</Box>
                            </Stack>
                            <DurationBadge minutes={5} />
                            <Box sx={{ flex: 1 }} />
                            <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                <Icon sx={{ fontSize: '0.8rem' }}>menu_book</Icon>
                                <Box>گرامر</Box>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Divider />
                </Box>
            ))}

            {/* Grammar test row */}
            <Stack spacing={1} sx={rowSx} onClick={() => navigate(`/lessons/${lessonId}/grammar-tests`)}>
                <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>Grammar Test</Typography>
                <Stack direction='row' sx={{ alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                    <DurationBadge minutes={5} />
                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                        <Icon sx={{ fontSize: '0.8rem' }}>quiz</Icon>
                        <Box>آزمون گرامر</Box>
                    </Stack>
                </Stack>
                <Typography variant='body2' sx={{ color: 'rgba(125,125,125,0.65)', direction: 'rtl' }}>
                    {grammars.length} سوال از گرامر این درس
                </Typography>
            </Stack>
        </Card>
    );
}
