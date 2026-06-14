import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { TypeWriter } from '../../../components/TypeWriter';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type Props = {
    vocabs: Array<VocabResponse>;
    lessonId: number;
};

export function VocabListItem ({ vocabs, lessonId }: Props) {

    const navigate = useNavigate();
    if (!vocabs.length) return null;

    const handleNavigateToVocabPage = () => {
        navigate(`/lessons/${lessonId}/vocabs`);
    };

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 1 }} onClick={handleNavigateToVocabPage}>
            <Stack spacing={2} >
                <Stack spacing={1} direction='column' sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>Vocabulary Review</Typography>
                    <Stack direction='row' sx={{ alignItems: 'center', gap: 1, width: '100%', justifyContent: 'end' }}>

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

        </ActionCard>
    );
}
