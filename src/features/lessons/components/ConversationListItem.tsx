import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

type StoryListItemProps = {
  story: StoryResponse;
  lessonId: number;
};

export function ConversationListItem ({ story, lessonId }: StoryListItemProps) {
  const navigate = useNavigate();

  const goToStory = () => navigate(`/lessons/${lessonId}/stories/${story.id}`);

  return (
    <ActionCard onClick={goToStory} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <LessonListItemHeader
          icon='conversation'
          label='Conversation'
          durationMinutes={story.duration}
        />

        <Stack spacing={1}>
          <Typography sx={{ direction: 'rtl' }} >
            {story.title}
          </Typography>

          <Stack direction='row' sx={{ gap: 0.5, alignItems: 'center' }}>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              مکالمه برای آشنایی با لغات و تمرین شنیداری
            </Typography>

          </Stack>
        </Stack>

      </Stack>
    </ActionCard >
  );
}
