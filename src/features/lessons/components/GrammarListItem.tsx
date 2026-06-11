import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { GrammarResponse } from '../../../api/Learnup/models/GrammarResponse';
import { ActionCard } from '../../../shared/components/ActionCard';

type Props = {
    grammar: GrammarResponse;
};

export function GrammarListItem ({ grammar }: Props) {

    const navigate = useNavigate();

    const handleNavigateToGrammarPage = () => {
        navigate(`/grammars/${grammar.id}`);
    };

    return (
        <ActionCard sx={{ overflow: 'hidden', borderRadius: 1 }} onClick={handleNavigateToGrammarPage}>
            <Stack spacing={1} sx={{ alignItems: 'start' }}>
                <Typography sx={{ lineHeight: '15px' }}>{grammar.name}</Typography>
                <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>

                    <Box sx={{ borderRadius: 1, bgcolor: 'warning.main', fontSize: '0.7rem', px: 0.8, py: 0.3 }}>
                        گرامر
                    </Box>

                    <Icon sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>timer</Icon>
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'arial' }}>
                        5 Min
                    </Typography>
                </Stack>
                <Typography sx={{ color: 'text.secondary', direction: 'rtl', fontSize: '0.7rem' }}>{grammar.description}</Typography>
            </Stack>
        </ActionCard>
    );
}
