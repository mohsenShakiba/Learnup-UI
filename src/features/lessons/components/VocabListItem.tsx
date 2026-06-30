import { Button, Divider, Stack, Typography } from '@mui/material';
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

    const handleNavigateToVocabTest = () => {
        navigate(`/lessons/${lessonId}/vocab-tests`);
    };

    return (
        <ActionCard sx={{ borderRadius: 2, p: 2 }} onClick={handleNavigateToVocabPage}>
            <Stack spacing={2} >
                <LessonListItemHeader
                    icon='translate'
                    label='مرور لغات'
                    durationMinutes={5}
                    color='success.main'
                />

                <Divider />

                <Typography variant='caption' sx={{ color: 'text.secondary' }}>مرور لغات استفاده شده در این درس</Typography>

                <Stack direction='row' spacing={1}>
                    <Button
                        fullWidth
                        onClick={(e) => {
                        }}
                    >
                        مطالعه لغات
                    </Button>
                </Stack>
            </Stack>
        </ActionCard>
    );
}
