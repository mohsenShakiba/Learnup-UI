import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { StoriesService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { StoryControls } from './components/StoryControls';
import { StoryCoverHeader } from './components/StoryCoverHeader';
import { StoryItem } from './components/StoryItem';
import { StoryAudioProvider } from './hooks/useStoryAudio';

export default function StoryDetailPage() {
  const { id: storyId } = useParams<{ id: string; }>();
  const storyIdNumber = Number(storyId);

  const storyQuery = useQuery({
    queryKey: ['story', storyIdNumber],
    queryFn: () => StoriesService.getStoryById(storyIdNumber),
    enabled: Number.isFinite(storyIdNumber),
  });

  const story = storyQuery.data;
  const storyItems = story?.items ?? [];

  if (storyQuery.isLoading) {
    return <AppLoader />;
  }

  if (storyQuery.isError || !story) {
    return <ErrorPage onAction={() => void storyQuery.refetch()} />;
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
