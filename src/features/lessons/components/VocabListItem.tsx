import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

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
        <ActionCard sx={{ borderRadius: 2, p: 2 }} onClick={handleNavigateToVocabPage}>
            <Stack spacing={2} >
                <LessonListItemHeader
                    icon='translate'
                    label='Vocabulary'
                    durationMinutes={3}
                />

                <Typography variant='body2' sx={{ color: 'text.secondary' }}>مرور لغات استفاده شده در این درس</Typography>
            </Stack>
        </ActionCard>
    );
}
