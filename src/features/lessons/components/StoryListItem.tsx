import { Button, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StoryResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

type StoryListItemProps = {
  story: StoryResponse;
  lessonId: number;
};

export function StoryListItem ({ story, lessonId }: StoryListItemProps) {
  const navigate = useNavigate();

  const goToStory = () => navigate(`/lessons/${lessonId}/stories/${story.id}`);

  return (
    <ActionCard onClick={goToStory} sx={{ p: 2 }}>
      <Stack spacing={1}>
        <LessonListItemHeader
          icon='auto_stories'
          label='داستان'
          durationMinutes={story.duration}
        />

        <Divider />

        <Stack spacing={1}>
          <Typography sx={{ direction: 'rtl' }} >
            {story.title}
          </Typography>

          <Typography variant='caption' sx={{ color: 'text.secondary' }} >
            {story.description}
          </Typography>
        </Stack>

        <Button fullWidth>مطالعه داستان</Button>
      </Stack>
    </ActionCard >
  );
}
