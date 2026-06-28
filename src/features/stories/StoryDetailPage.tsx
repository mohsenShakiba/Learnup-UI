import { Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { StorySection } from '../../api/Learnup';
import { useLesson } from '../lessons/hooks/useLesson';
import { useSectionCompleted } from '../lessons/hooks/useSectionCompleted';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { StoryControls } from './components/StoryControls';
import { StoryItem } from './components/StoryItem';
import { StoryAudioProvider } from './hooks/useStoryAudio';

export default function StoryDetailPage () {
  const { lessonId, id: storyId } = useParams<{ lessonId: string; id: string; }>();
  const lessonIdNumber = Number(lessonId);
  const storyIdNumber = Number(storyId);

  const lessonQuery = useLesson(lessonIdNumber);
  const story = lessonQuery.data?.stories.find((item) => item.id === storyIdNumber);
  const storyItems = story?.items ?? [];

  useSectionCompleted(lessonIdNumber, StorySection.STORY, story != null);

  if (lessonQuery.isLoading) {
    return <AppLoader />;
  }

  if (lessonQuery.isError || !story) {
    return <ErrorPage onAction={() => void lessonQuery.refetch()} />;
  }

  return (
    <StoryAudioProvider storyItems={storyItems}>
      <Scaffold header={<DefaultHeader header='داستان' subtitle={story.title} />}>
        <Stack direction='column' sx={{ gap: 1, pb: 12 }}>
          {storyItems.map((item) => (
            <StoryItem key={item.id} item={item} />
          ))}
        </Stack>
        <StoryControls />
      </Scaffold>
    </StoryAudioProvider>
  );
}
