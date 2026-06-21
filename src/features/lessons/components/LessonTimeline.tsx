import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LessonVocabTestResponse } from '../../../api/Learnup';
import type { GrammarResponse } from '../../../api/Learnup/models/GrammarResponse';
import type { StoryResponse } from '../../../api/Learnup/models/StoryResponse';
import type { VocabResponse } from '../../../api/Learnup/models/VocabResponse';
import { TypeWriter } from '../../../components/TypeWriter';
import { ActionCard } from '../../../shared/components/ActionCard';
import { DurationBadge } from '../../../shared/components/DurationBadge';
import { StoryListItem } from './StoryListItem';

type Props = {
    stories: StoryResponse[];
    grammars: GrammarResponse[];
    vocabs: VocabResponse[];
    vocabTest?: LessonVocabTestResponse;
    lessonId: number;
};

function TimelineDot({ isCompleted }: { isCompleted: boolean }) {
    return (
        <Box sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: isCompleted ? 'success.main' : 'text.disabled',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            <Icon sx={{ fontSize: '0.8rem', color: 'white' }}>
                {isCompleted ? 'check' : 'schedule'}
            </Icon>
        </Box>
    );
}

function TimelineItem({ isCompleted, isLast, children }: { isCompleted: boolean; isLast: boolean; children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', gap: 1.5 }}>
            {/* Timeline column – first child sits on the RIGHT in RTL layout */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                <TimelineDot isCompleted={isCompleted} />
                {!isLast && (
                    <Box sx={{ width: 2, flex: 1, minHeight: 16, mt: 0.5, bgcolor: 'divider' }} />
                )}
            </Box>
            {/* Content */}
            <Box sx={{ flex: 1, pb: isLast ? 0 : 2 }}>
                {children}
            </Box>
        </Box>
    );
}

export function LessonTimeline({ stories, grammars, vocabs, vocabTest, lessonId }: Props) {
    const navigate = useNavigate();

    const hasGrammars = grammars.length > 0;
    const hasVocabs = vocabs.length > 0;
    const totalItems =
        stories.length +
        grammars.length +
        (hasGrammars ? 1 : 0) +
        (hasVocabs ? 2 : 0);

    const grammarOffset = stories.length;
    const grammarTestIndex = grammarOffset + grammars.length;
    const vocabReviewIndex = grammarTestIndex + (hasGrammars ? 1 : 0);
    const vocabTestIndex = vocabReviewIndex + 1;

    const isLast = (i: number) => i === totalItems - 1;

    const isPassed = vocabTest?.isPassed ?? false;

    return (
        <Box>
            {stories.map((story, i) => (
                <TimelineItem key={`story-${story.id}`} isCompleted={story.isCompleted} isLast={isLast(i)}>
                    <StoryListItem story={story} />
                </TimelineItem>
            ))}

            {grammars.map((grammar, i) => (
                <TimelineItem key={`grammar-${grammar.id}`} isCompleted={false} isLast={isLast(grammarOffset + i)}>
                    <ActionCard onClick={() => navigate(`/grammars/${grammar.id}`)}>
                        <Stack spacing={1}>
                            <Typography sx={{ fontSize: '1.1rem' }}>{grammar.name}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{grammar.description}</Typography>
                            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                                <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', px: 0.8, py: 0.4, fontSize: '0.7rem', bgcolor: 'warning.main', borderRadius: 1, color: 'white' }}>
                                    <Icon sx={{ fontSize: '0.8rem' }}>hourglass_empty</Icon>
                                    <Box>در انتظار</Box>
                                </Stack>
                                <DurationBadge minutes={5} />
                                <Box sx={{ flex: 1 }} />
                                <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                    <Icon sx={{ fontSize: '0.8rem' }}>menu_book</Icon>
                                    <Box>گرامر</Box>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ActionCard>
                </TimelineItem>
            ))}

            {hasGrammars && (
                <TimelineItem isCompleted={false} isLast={isLast(grammarTestIndex)}>
                    <ActionCard onClick={() => navigate(`/lessons/${lessonId}/grammar-tests`)}>
                        <Stack spacing={1}>
                            <Typography sx={{ fontSize: '1.1rem' }}>Grammar Test</Typography>
                            <Stack direction='row' sx={{ alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                                <DurationBadge minutes={5} />
                                <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                    <Icon sx={{ fontSize: '0.8rem' }}>quiz</Icon>
                                    <Box>آزمون گرامر</Box>
                                </Stack>
                            </Stack>
                            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                                {grammars.length} سوال از گرامر این درس
                            </Typography>
                        </Stack>
                    </ActionCard>
                </TimelineItem>
            )}

            {hasVocabs && (
                <TimelineItem isCompleted={false} isLast={isLast(vocabReviewIndex)}>
                    <ActionCard onClick={() => navigate(`/lessons/${lessonId}/vocabs`)}>
                        <Stack spacing={2}>
                            <Stack spacing={1}>
                                <Typography sx={{ fontSize: '1.1rem' }}>Vocabulary Review</Typography>
                                <Stack direction='row' sx={{ alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                                    <DurationBadge minutes={8} />
                                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'success.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                        <Icon sx={{ fontSize: '0.8rem' }}>translate</Icon>
                                        <Box>مرور لغات</Box>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Box sx={{ color: 'text.disabled', fontSize: '25px', lineHeight: '22px', height: 25 }}>
                                <TypeWriter words={vocabs.map(v => v.word)} />
                            </Box>
                        </Stack>
                    </ActionCard>
                </TimelineItem>
            )}

            {hasVocabs && (
                <TimelineItem isCompleted={isPassed} isLast={isLast(vocabTestIndex)}>
                    <ActionCard onClick={() => navigate(`/lessons/${lessonId}/vocab-tests`)}>
                        <Stack spacing={1}>
                            <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '1.1rem' }}>Vocabulary Test</Typography>
                                {isPassed && (
                                    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'success.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                        <Icon sx={{ fontSize: '0.8rem' }}>check_circle</Icon>
                                        <Box>تکمیل شده</Box>
                                    </Stack>
                                )}
                            </Stack>
                            <Stack direction='row' sx={{ alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                                {isPassed && (
                                    <Typography sx={{ fontSize: '0.75rem', color: 'success.main', fontFamily: 'arial' }}>
                                        {vocabTest!.score}%
                                    </Typography>
                                )}
                                <DurationBadge minutes={5} />
                                <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', borderRadius: 1, bgcolor: 'secondary.main', fontSize: '0.7rem', px: 0.8, py: 0.3, color: 'white' }}>
                                    <Icon sx={{ fontSize: '0.8rem' }}>quiz</Icon>
                                    <Box>آزمون لغات</Box>
                                </Stack>
                            </Stack>
                            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                                {vocabs.length} سوال از لغات این درس
                            </Typography>
                        </Stack>
                    </ActionCard>
                </TimelineItem>
            )}
        </Box>
    );
}
