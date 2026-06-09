import { Box, Card, Stack, Typography } from '@mui/material';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';

type Props = {
    vocabs: Array<VocabResponse>;
};

export function VocabBox ({ vocabs }: Props) {

    if (!vocabs.length) return null;


    return (
        <Card sx={{ overflow: 'hidden', borderRadius: 2 }}>
            <Stack sx={{ alignItems: 'start' }}>
                <Typography>Vocabulary Review</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>مرور کلمات</Typography>
                <Box sx={{ bgcolor: 'secondary.main', px: 1, py: 0.5, borderRadius: 1, mt: 1.5 }}>
                    <Typography sx={{ fontSize: '0.8rem' }}>{vocabs.length} Words</Typography>
                </Box>
            </Stack>
        </Card>
    );
}
