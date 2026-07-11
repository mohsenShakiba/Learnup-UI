import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ConversationResponse } from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';
import { LessonListItemHeader } from './LessonListItemHeader';

type ConversationListItemProps = {
  conversation: ConversationResponse;
  lessonId: number;
};

export function ConversationListItem ({ conversation, lessonId }: ConversationListItemProps) {
  const navigate = useNavigate();

  const goToConversation = () => navigate(`/lessons/${lessonId}/conversations/${conversation.id}`);

  return (
    <ActionCard onClick={goToConversation} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <LessonListItemHeader
          icon='conversation'
          label='Conversation'
          durationMinutes={conversation.duration}
        />

        <Stack spacing={1}>
          <Typography sx={{ direction: 'rtl' }} >
            {conversation.title}
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
