import type { StoryItemResponse } from '../../../api/Learnup';
import { useStoryAudio } from './useStoryAudio';

export function useStoryItem (item: StoryItemResponse) {
  const {
    activeItemId,
    playbackStatus,
    playItemAudio,
    showTranslation,
  } = useStoryAudio();

  const itemId = item.id;

  const playItem = () => {
    if (itemId != null) {
      void playItemAudio(itemId);
    }
  };

  return {
    isPlaying: itemId === activeItemId && playbackStatus === 'playing',
    showTranslation,
    playItem,
  };
}
