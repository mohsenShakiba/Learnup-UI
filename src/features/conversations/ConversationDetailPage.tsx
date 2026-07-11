import { Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { UserLessonStatus } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { useLesson } from '../lessons/hooks/useLesson';
import { useSectionCompleted } from '../lessons/hooks/useSectionCompleted';
import { ConversationControls } from './components/ConversationControls';
import { ConversationItem } from './components/ConversationItem';
import { ConversationAudioProvider } from './hooks/useConversationAudio';

export default function ConversationDetailPage () {
  const { lessonId, id: conversationId } = useParams<{ lessonId: string; id: string; }>();
  const lessonIdNumber = Number(lessonId);
  const conversationIdNumber = Number(conversationId);

  const lessonQuery = useLesson(lessonIdNumber);
  const conversation = lessonQuery.data?.conversations.find((item) => item.id === conversationIdNumber);
  const conversationItems = conversation?.items ?? [];

  useSectionCompleted(lessonIdNumber, UserLessonStatus.CONVERSATION_COMPLETED, conversation != null);

  if (lessonQuery.isLoading) {
    return <AppLoader />;
  }

  if (lessonQuery.isError || !conversation) {
    return <ErrorPage onAction={() => void lessonQuery.refetch()} />;
  }

  return (
    <ConversationAudioProvider conversationId={conversationIdNumber} conversationItems={conversationItems}>
      <Scaffold header={<DefaultHeader header='مکالمه' />}>
        <Stack direction='column' sx={{ gap: 1, pb: 0 }}>
          {conversationItems.map((item) => (
            <ConversationItem key={item.id} conversationId={conversationIdNumber} item={item} />
          ))}
        </Stack>
        <ConversationControls />
      </Scaffold>
    </ConversationAudioProvider>
  );
}
