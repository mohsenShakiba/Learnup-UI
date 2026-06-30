import { Button, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { TestResponse } from '../../../api/Learnup/models/TestResponse';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

type Props = {
    tests: Array<TestResponse>;
    lessonId: number;
};

export function TestListItem({ tests, lessonId }: Props) {

    const navigate = useNavigate();
    if (!tests.length) return null;

    const handleNavigateToTest = () => {
        navigate(`/lessons/${lessonId}/tests`);
    };

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 2 }} onClick={handleNavigateToTest}>
            <Stack spacing={2}>
                <LessonListItemHeader
                    icon='quiz'
                    label='آزمون'
                    durationMinutes={5}
                    color='warning.main'
                />

                <Divider />

                <Typography variant='caption' sx={{ color: 'text.secondary' }}>آزمون پایانی این درس</Typography>

                <Button
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToTest();
                    }}
                >
                    شروع آزمون
                </Button>
            </Stack>
        </ActionCard>
    );
}
