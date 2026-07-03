import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LessonResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonTimeline } from '../../lessons/components/LessonTimeline';

type LessonListItemProps = {
  lesson: LessonResponse;
  isLast?: boolean;
};

export function LessonListItem({ lesson, isLast = false }: LessonListItemProps) {

  const navigate = useNavigate();
  const navigateToLesson = () => {
    navigate(`/lessons/${lesson.id}`);
  };

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'stretch' }}>
      <ActionCard onClick={navigateToLesson} sx={{ flex: 1, borderRadius: 2 }}>
        <Stack spacing={1} sx={{ alignItems: 'flex-end' }}>
          <Typography variant='caption' sx={{ color: 'primary.main', fontFamily: 'Roboto' }} >
            Lesson {lesson.order}
          </Typography>
          <Typography variant='body1' sx={{ direction: 'rtl' }}>
            {lesson.title}
          </Typography>
        </Stack>
      </ActionCard >
      <LessonTimeline completed={lesson.isCompleted} isLast={isLast} />
    </Stack>
  );
}
