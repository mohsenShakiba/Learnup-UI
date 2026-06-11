import { Box, Divider, Icon, Stack, Typography } from '@mui/material';
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

            <Stack spacing={1} sx={{}}>

                <Typography sx={{ lineHeight: '15px' }}>{grammar.name}</Typography>

                <Typography sx={{ color: 'text.secondary', direction: 'rtl', fontSize: '0.7rem' }}>{grammar.description}</Typography>

                <Divider />

                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>

                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'primary.main', fontSize: '0.7rem', px: 0.8, py: 0.3 }}>
                        <Icon sx={{ fontSize: '0.8rem' }}>menu_book</Icon>
                        <Box>گرامر</Box>
                    </Stack>

                    <Icon sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>timer</Icon>
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'arial' }}>
                        5 Min
                    </Typography>


                    <Box sx={{ flex: 1 }}></Box>

                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', px: 0.8, py: 0.4, fontSize: '0.7rem', bgcolor: 'warning.main', borderRadius: 1 }}>
                        <Icon sx={{ fontSize: '0.8rem' }}>hourglass_empty</Icon>
                        <Box>در انتظار</Box>
                    </Stack>
                </Stack>

            </Stack>
        </ActionCard>
    );
}
