import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LessonVocabTestResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type Props = {
    lessonId: number;
    vocabCount: number;
    vocabTest?: LessonVocabTestResponse;
};

export function VocabTestListItem({ lessonId, vocabCount, vocabTest }: Props) {
    const navigate = useNavigate();
    if (!vocabCount) return null;

    const isPassed = vocabTest?.isPassed ?? false;

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 2 }} onClick={() => navigate(`/lessons/${lessonId}/vocab-tests`)}>
            <Stack spacing={2}>
                <Stack spacing={1} direction='column' sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>Vocabulary Test</Typography>
                        {isPassed && (
                            <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'success.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                <Icon sx={{ fontSize: '0.8rem' }}>check_circle</Icon>
                                <Box>تکمیل شده</Box>
                            </Stack>
                        )}
                    </Stack>
                    <Stack direction='row' sx={{ alignItems: 'center', gap: 1, width: '100%', justifyContent: 'end' }}>
                        {isPassed && (
                            <Typography sx={{ fontSize: '0.75rem', color: 'success.main', fontFamily: 'arial' }}>
                                {vocabTest!.score}%
                            </Typography>
                        )}
                        <DurationBadge minutes={5} />
                        <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                            <Icon sx={{ fontSize: '0.8rem' }}>quiz</Icon>
                            <Box>آزمون لغات</Box>
                        </Stack>
                    </Stack>
                </Stack>

                <Typography variant='body2' sx={{ color: 'rgba(125,125,125,0.65)', direction: 'rtl' }}>
                    {vocabCount} سوال از لغات این درس
                </Typography>
            </Stack>
        </ActionCard>
    );
}
