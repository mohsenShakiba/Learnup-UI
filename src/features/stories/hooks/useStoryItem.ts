import type { StoryItemResponse } from '../../../api/Learnup';
import { useStoryAudio } from './useStoryAudio';

export function useStoryItem (item: StoryItemResponse) {
  const {
    activeItemId,
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
    isActive: itemId === activeItemId,
    showTranslation,
    playItem,
  };
}
