import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { TestResponse } from '../../../api/Learnup/models/TestResponse';
import { TestType } from '../../../api/Learnup/models/TestType';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

type Props = {
    tests: Array<TestResponse>;
    lessonId: number;
};

export function TestListItem ({ tests, lessonId }: Props) {

    const navigate = useNavigate();
    if (!tests.length) return null;

    const handleNavigateToTest = () => {
        const hasGrammarTests = tests.some((test) => test.type === TestType.GRAMMAR);
        const hasIncompleteGrammarTests = tests.some((test) => test.type === TestType.GRAMMAR && test.isCorrect === null);
        const hasIncompleteVocabTests = tests.some((test) => test.type === TestType.VOCAB && test.isCorrect === null);
        const target = hasIncompleteGrammarTests || (hasGrammarTests && !hasIncompleteVocabTests)
            ? 'grammar-tests'
            : 'vocab-tests';

        navigate(`/lessons/${lessonId}/${target}`);
    };

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 2, p: 2 }} onClick={handleNavigateToTest}>
            <Stack spacing={2}>
                <LessonListItemHeader
                    icon='quiz'
                    label='Test'
                    durationMinutes={5}
                    color='warning.main'
                />
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>آزمون مروری گرامر و لغات</Typography>
            </Stack>
        </ActionCard>
    );
}
