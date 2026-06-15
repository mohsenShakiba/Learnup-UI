import { Card, Chip, CircularProgress, Divider, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { VocabTransactionType } from '../../../api/Learnup/models/VocabTransactionType';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

const typeLabel: Record<VocabTransactionType, string> = {
    [VocabTransactionType.NOUN]: 'اسم',
    [VocabTransactionType.VERB]: 'فعل',
};

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
        <Card sx={{ borderRadius: 1, p: 1.5 }}>
            <Stack spacing={1}>
                {/* Word row */}
                <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6'>{vocab.word}</Typography>
                    {vocab.voiceId && (
                        <IconButton size='small' onClick={() => void handlePlayVoice()} disabled={isLoadingVoice}>
                            {isLoadingVoice
                                ? <CircularProgress size={20} />
                                : <Icon>volume_up</Icon>}
                        </IconButton>
                    )}
                </Stack>

                {/* Translations */}
                {vocab.translations.length > 0 && (
                    <Stack spacing={1} divider={<Divider />}>
                        {vocab.translations.map((t) => (
                            <Stack key={t.id} spacing={0.5}>
                                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 500 }}>{t.translation}</Typography>
                                    <Chip
                                        label={typeLabel[t.type]}
                                        size='small'
                                        variant='outlined'
                                        sx={{ fontSize: '0.65rem', height: 18 }}
                                    />
                                </Stack>

                                {t.description && (
                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                        {t.description}
                                    </Typography>
                                )}

                                {t.example && (
                                    <Stack spacing={0.25} sx={{ pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
                                        <Typography variant='body2' sx={{ fontStyle: 'italic' }}>{t.example}</Typography>
                                        {t.exampleTranslation && (
                                            <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                                {t.exampleTranslation}
                                            </Typography>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        ))}
                    </Stack>
                )}

                {/* Fallback to flat translation if no translations array */}
                {vocab.translations.length === 0 && vocab.translation && (
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        {vocab.translation}
                    </Typography>
                )}
            </Stack>
        </Card>
    );
}
