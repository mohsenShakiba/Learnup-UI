import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LessonResponse } from '../../../api/Learnup';
import { FancyButton } from '../../../shared/components/FancyButton';
import { RadarPulse } from '../../../shared/components/RadarPulse';

type Props = {
  lesson?: LessonResponse;
};

type CompletionBoxProps = {
  label: string;
  icon: string;
  done: boolean;
};

function CompletionBox ({ label, icon, done }: CompletionBoxProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        py: 1,
        borderRadius: 2,
        bgcolor: done ? 'success.main' : 'rgba(0,0,0,0.15)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Icon sx={{ fontSize: '1.1rem', color: done ? 'white' : 'rgba(255,255,255,0.5)' }}>{done ? 'check_circle' : icon}</Icon>
      <Typography sx={{ fontSize: '0.65rem', color: done ? 'white' : 'rgba(255,255,255,0.5)' }}>{label}</Typography>
    </Box>
  );
}

export function ContinueCard ({ lesson }: Props) {
  const navigate = useNavigate();

  const storyDone = lesson != null && lesson.storiesCount > 0 && lesson.completedStoriesCount >= lesson.storiesCount;
  const grammarDone = lesson != null && lesson.grammarsCount > 0 && lesson.completedGrammarsCount >= lesson.grammarsCount;
  const vocabDone = lesson != null && lesson.vocabsCount > 0 && lesson.completedVocabsCount >= lesson.vocabsCount;

  return (
    <Card
      elevation={0}
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >

      <RadarPulse />

      <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>

        {/* Lesson info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              fontSize: 26,
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
          >
            📖
          </Box>

          <Stack>
            <Typography variant="body1">
              {lesson ? `LESSON ${lesson.order}` : '...'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {lesson?.title ?? ''}
            </Typography>
          </Stack>
        </Box>

        {/* Completion boxes */}
        <Stack direction="row" spacing={1}>
          <CompletionBox label="داستان" icon="menu_book" done={storyDone} />
          <CompletionBox label="گرامر" icon="spellcheck" done={grammarDone} />
          <CompletionBox label="لغات" icon="translate" done={vocabDone} />
        </Stack>

        {/* CTA */}
        <FancyButton
          fullWidth
          variant="contained"
          endIcon={<ArrowBackIcon />}
          onClick={() => lesson && navigate(`/lessons/${lesson.id}`)}
        >
          ادامه درس
        </FancyButton>

      </Stack>
    </Card>
  );
}
