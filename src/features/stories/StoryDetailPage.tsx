import { CircularProgress, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { StoriesService } from '../../api/Learnup';
import { EmptyList } from '../../shared/components/EmptyList';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { StoryControls } from './components/StoryControls';
import { StoryItem } from './components/StoryItem';
import { StoryAudioProvider } from './hooks/useStoryAudio';

export default function StoryDetailPage () {
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
    return <CircularProgress />;
  }

  if (storyQuery.isError || !story) {
    return <ErrorPage onAction={() => void storyQuery.refetch()} />;
  }

  return (
    <StoryAudioProvider storyItems={storyItems}>
      <Scaffold title={story.title}>
        <Stack>
          {storyItems.length === 0 ? (
            <EmptyList />
          ) : (
            <Stack spacing={1}>
              {storyItems.map((item) => (
                <StoryItem key={item.id} item={item} />
              ))}
            </Stack>
          )}
        </Stack>
        <StoryControls />
      </Scaffold>
    </StoryAudioProvider>
  );
}
