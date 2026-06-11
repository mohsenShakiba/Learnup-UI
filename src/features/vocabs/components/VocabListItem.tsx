import { Card, CircularProgress, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

type Props = {
    vocab: VocabResponse;
};

export function VocabListItem ({ vocab }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);
    const [isLoadingVoice, setIsLoadingVoice] = useState(false);

    useEffect(() => () => {
        audioRef.current?.pause();
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
        }
    }, []);

    const handlePlayVoice = async () => {
        try {
            setIsLoadingVoice(true);

            if (!audioRef.current) {
                const response = await fetch(`${apiBaseUrl}/Mobile/Files/${vocab.voiceId}`);

                if (!response.ok) {
                    throw new Error(`Failed to load voice for vocab ${vocab.id}`);
                }

                objectUrlRef.current = URL.createObjectURL(await response.blob());
                audioRef.current = new Audio(objectUrlRef.current);
            }

            audioRef.current.currentTime = 0;
            await audioRef.current.play();
        } catch (err) {
            console.error('Failed to play vocab voice:', err);
        } finally {
            setIsLoadingVoice(false);
        }
    };

    return (
        <Card sx={{ borderRadius: 1 }}>
            <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack spacing={0.5}>
                    <Typography>{vocab.word}</Typography>
                    {vocab.translation && (
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {vocab.translation}
                        </Typography>
                    )}


                    <Typography>{vocab.description}</Typography>

                </Stack>

                {vocab.voiceId && (
                    <IconButton onClick={() => void handlePlayVoice()} disabled={isLoadingVoice}>
                        {isLoadingVoice
                            ? <CircularProgress size={20} />
                            : <Icon>volume_up</Icon>}
                    </IconButton>
                )}
            </Stack>
        </Card>
    );
}
