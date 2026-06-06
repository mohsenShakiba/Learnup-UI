import { CircularProgress, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { StoriesService } from '../../api/Learnup';
import { EmptyList } from '../../shared/components/EmptyList';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';
import { StoryControls } from './components/StoryControls';
import { StoryItem } from './components/StoryItem';
import { useStoryAudio } from './hooks/useStoryAudio';

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

  const {
    activeItemId,
    playItemAudio,

  } = useStoryAudio(storyItems);


  if (storyQuery.isLoading) {
    return <CircularProgress />;
  }

  if (storyQuery.isError || !story) {
    return <ErrorPage onAction={() => void storyQuery.refetch()} />;
  }

  return (
    <Scaffold title={story.title}>
      <Stack>
        {storyItems.length === 0 ? (
          <EmptyList />
        ) : (
          <Stack spacing={2}>
            {storyItems.map((item, index) => (
              <StoryItem
                key={item.id ?? `${item.order ?? index}-${index}`}
                item={item}
                isActive={item.id === activeItemId}
                onPlay={playItemAudio}
              />
            ))}
          </Stack>
        )}
      </Stack>
      <StoryControls story={story} />
    </Scaffold>
  );
}
