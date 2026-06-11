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
            <Stack sx={{ alignItems: 'start' }} spacing={1}>

                <Stack spacing={1} direction='column' sx={{ alignItems: 'start', justifyContent: 'space-between', width: '100%' }}>
                    <Typography sx={{ lineHeight: '15px' }}>Vocabulary Review</Typography>
                    <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>

                        <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'success.main', fontSize: '0.7rem', px: 0.8, py: 0.3 }}>
                            <Icon sx={{ fontSize: '0.8rem' }}>translate</Icon>
                            <Box>مرور لغات</Box>
                        </Stack>
                        <DurationBadge minutes={8} />
                    </Stack>
                </Stack>

                <Stack direction='row' sx={{ alignItems: 'end', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '25px', lineHeight: '22px' }}>
                        <TypeWriter words={vocabs.map(v => v.word)} />
                    </Box>
                    <Box sx={{ bgcolor: 'warning.main', px: 1, py: 0.5, borderRadius: 1, mt: 1.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontFamily: 'arial' }}>{vocabs.length} Vocabularies</Typography>
                    </Box>
                </Stack>

            </Stack>
        </ActionCard>
    );
}
