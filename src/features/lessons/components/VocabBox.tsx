import { Box, Card, Divider, Icon, LinearProgress, Stack, Typography } from '@mui/material';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { TypeWriter } from '../../../components/TypeWriter';

type Props = {
    vocabs: Array<VocabResponse>;
};

export function VocabBox ({ vocabs }: Props) {

    if (!vocabs.length) return null;

    return (
        <Card sx={{ overflow: 'hidden', borderRadius: 1 }}>
            <Stack sx={{ alignItems: 'start' }} spacing={1}>

                <Stack spacing={1} direction='column' sx={{ alignItems: 'start', justifyContent: 'space-between', width: '100%' }}>
                    <Typography sx={{ lineHeight: '15px' }}>Vocabulary Review</Typography>
                    <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>مرور کلمات</Typography>
                        <Divider orientation='vertical' sx={{ height: '10px', }} />
                        <Icon sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>timer</Icon>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'arial' }}>
                            8 MIN
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction='row' sx={{ alignItems: 'end', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '25px', lineHeight: '22px' }}>
                        <TypeWriter words={vocabs.map(v => v.word)} />
                    </Box>
                    <Box sx={{ bgcolor: 'warning.main', px: 1, py: 0.5, borderRadius: 1, mt: 1.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontFamily: 'arial' }}>0 of {vocabs.length} vocabs</Typography>
                    </Box>
                </Stack>

                <LinearProgress variant='determinate' value={20} color='warning' sx={{ width: '100%', borderRadius: 1 }} />
            </Stack>
        </Card>
    );
}
