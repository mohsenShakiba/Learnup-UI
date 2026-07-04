import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { CurrentLessonProgressResponse } from '../../../api/Learnup';
import { AppIcon } from '../../../shared/components/AppIcon';
import { FancyButton } from '../../../shared/components/FancyButton';

type Props = {
  lesson?: CurrentLessonProgressResponse;
};

type CompletionBoxProps = {
  label: string;
  icon: string;
  done: boolean;
};

function CompletionBox ({ label, icon, done }: CompletionBoxProps) {
  return (
    <AppIcon sx={{
      bgcolor: done ? 'success.main' : 'rgba(125,125,125,0.50)',
      p: 0.5,
      lineHeight: '25px',
      borderRadius: 1,
      color: 'white'
    }}>{icon}</AppIcon>
  );
}

export function ContinueCard ({ lesson }: Props) {
  const navigate = useNavigate();

  const storyDone = lesson?.isStoryCompleted ?? false;
  const grammarDone = lesson?.isGrammarCompleted ?? false;
  const vocabDone = lesson?.isVocabCompleted ?? false;

  return (
    <Card
      elevation={0}
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >

      <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>

        {/* Lesson info */}
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>

          <Stack spacing={0.5}>
            <Typography variant='body2' sx={{}}>برای ادامه درس آماده اید؟</Typography>
            <Stack direction='row' sx={{ gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {lesson?.courseSlug}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>-</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                درس {lesson?.order}
              </Typography>
            </Stack>
          </Stack>


          <Box sx={{ flex: 1 }} />

          {/* Completion boxes */}
          <Stack direction="row" spacing={1}>
            <CompletionBox label="داستان" icon="conversation" done={storyDone} />
            <CompletionBox label="گرامر" icon="menu_book" done={grammarDone} />
            <CompletionBox label="لغات" icon="translate" done={vocabDone} />
            <CompletionBox label="تست" icon="quiz" done={vocabDone} />
          </Stack>
        </Box>

        {/* CTA */}
        <FancyButton
          fullWidth
          variant="contained"
          endIcon={<ArrowBackIcon />}
          onClick={() => lesson && navigate(`/lessons/${lesson.lessonId}`)}
        >
          ادامه درس
        </FancyButton>

      </Stack>
    </Card>
  );
}
