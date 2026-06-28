import { Box, Card, Divider, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { TypeWriter } from '../../../components/TypeWriter';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type Props = {
    vocabs: Array<VocabResponse>;
    lessonId: number;
};

const rowSx = {
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
    '&:active': { opacity: 0.7 },
    p: 1.5,
};

export function VocabSection ({ vocabs, lessonId }: Props) {
    const navigate = useNavigate();
    if (!vocabs.length) return null;

    return (
        <Card elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            {/* Review row */}
            <Stack spacing={2} sx={rowSx} onClick={() => navigate(`/lessons/${lessonId}/vocabs`)}>
                <Stack direction='column' spacing={1}>
                    <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>Vocabulary Review</Typography>
                    <Stack direction='row' sx={{ alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                        <DurationBadge minutes={8} />
                        <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'success.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                            <Icon sx={{ fontSize: '0.8rem' }}>translate</Icon>
                            <Box>مرور لغات</Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Box sx={{ color: 'rgba(125,125,125,0.65)', fontSize: '25px', lineHeight: '22px', height: 25, direction: 'rtl' }}>
                    <TypeWriter words={vocabs.map(v => v.word)} />
                </Box>
            </Stack>

            <Divider />
        </Card>
    );
}
