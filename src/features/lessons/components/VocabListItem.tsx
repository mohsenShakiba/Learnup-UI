import { Box, Button, Divider, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { TypeWriter } from '../../../components/TypeWriter';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type Props = {
    vocabs: Array<VocabResponse>;
    lessonId: number;
};

export function VocabListItem({ vocabs, lessonId }: Props) {

    const navigate = useNavigate();
    if (!vocabs.length) return null;

    const handleNavigateToVocabPage = () => {
        navigate(`/lessons/${lessonId}/vocabs`);
    };

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 2 }} onClick={handleNavigateToVocabPage}>
            <Stack spacing={2} >
                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>

                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'success.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                        <Icon sx={{ fontSize: '0.8rem' }}>translate</Icon>
                        <Box>مرور لغات</Box>
                    </Stack>

                    <Box sx={{ flex: 1 }}></Box>

                    <DurationBadge minutes={5} />
                </Stack>

                <Divider />

                <Typography variant='caption' sx={{ color: 'text.secondary' }}>مرور لغات استفاده شده در این درس</Typography>

                <Button size='small'>مرور لغات</Button>

            </Stack>

        </ActionCard>
    );
}
