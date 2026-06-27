import { Box, Button, Divider, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { GrammarResponse } from '../../../api/Learnup/models/GrammarResponse';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';

type Props = {
    grammar: GrammarResponse;
    lessonId: number;
};

export function GrammarListItem({ grammar, lessonId }: Props) {

    const navigate = useNavigate();

    const handleNavigateToGrammarPage = () => {
        navigate(`/grammars/${grammar.id}`);
    };

    const handleNavigateToGrammarTest = () => {
        navigate(`/lessons/${lessonId}/grammar-tests`);
    };

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 2, }} onClick={handleNavigateToGrammarPage}>

            <Stack spacing={1} sx={{}}>

                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                        <Icon sx={{ fontSize: '0.8rem' }}>menu_book</Icon>
                        <Box>گرامر</Box>
                    </Stack>

                    <Box sx={{ flex: 1 }}></Box>

                    <DurationBadge minutes={5} />
                </Stack>

                <Divider />

                <Typography sx={{ lineHeight: '15px', fontSize: '1.1rem', direction: 'rtl' }}>{grammar.name}</Typography>

                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{grammar.description}</Typography>

                <Stack direction='row' spacing={1}>
                    <Button
                        sx={{ flex: 2 }}
                        size='small'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToGrammarPage();
                        }}
                    >
                        مطالعه گرامر
                    </Button>
                    <Button
                        sx={{ flex: 1 }}
                        size='small'
                        variant='outlined'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToGrammarTest();
                        }}
                    >
                        آزمون
                    </Button>
                </Stack>

            </Stack>
        </ActionCard>
    );
}
