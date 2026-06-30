import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { GrammarResponse } from '../../../api/Learnup/models/GrammarResponse';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

type Props = {
    grammar: GrammarResponse;
    lessonId: number;
};

export function GrammarListItem ({ grammar, lessonId }: Props) {

    const navigate = useNavigate();

    const handleNavigateToGrammarPage = () => {
        navigate(`/grammars/${grammar.id}`, { state: { lessonId } });
    };

    const handleNavigateToGrammarTest = () => {
        navigate(`/lessons/${lessonId}/grammar-tests`);
    };

    return (
        <ActionCard sx={{ p: 2 }} onClick={handleNavigateToGrammarPage}>
            <Stack spacing={2}>
                <LessonListItemHeader
                    icon='menu_book'
                    label='Grammar'
                    durationMinutes={grammar.duration}
                    color='secondary.main'
                />

                <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>{grammar.name}</Typography>

                <Typography variant='body2' sx={{ color: 'text.secondary' }}>{grammar.description}</Typography>

            </Stack>
        </ActionCard>
    );
}
