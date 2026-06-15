import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import type { StoryItemResponse, StoryItemTimestampResponse } from '../../../api/Learnup';

export type PlaybackStatus = 'idle' | 'playing' | 'paused';


type UseStoryAudioResult = {
  activeItemId: number | null;
  activeTimestampIndex: number;
  audioProgress: number;
  audioRef: RefObject<HTMLAudioElement | null>;
  playbackStatus: PlaybackStatus;
  playableItemCount: number;
  progressPercentage: number;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  hasAudio: (itemId: number | null | undefined) => boolean;
  playItemAudio: (itemId: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  restart: () => Promise<void>;
  playNextItem: () => Promise<void>;
  playPreviousItem: () => Promise<void>;
  handleAudioEnded: () => void;
  handleLoadedMetadata: () => void;
  handlePause: () => void;
  handleTimeUpdate: () => void;
};

const StoryAudioContext = createContext<UseStoryAudioResult | null>(null);

const getActiveTimestampIndex = (
  timestamps: StoryItemTimestampResponse[] | null | undefined,
  currentTime: number,
) => {
  if (!timestamps?.length) {
    return -1;
  }

  // Highlight the last word whose start has passed, rather than requiring the
  // sampled currentTime to fall strictly inside a [start, end) window. Polling
  // is coarse (~40ms), so short words / gaps between words would otherwise be
  // skipped entirely and never highlighted. Assumes timestamps are ordered by start.
  let activeIndex = -1;

  for (let index = 0; index < timestamps.length; index += 1) {
    const { start } = timestamps[index];

    if (start == null) {
      continue;
    }

    if (currentTime < start) {
      break;
    }

    activeIndex = index;
  }

  return activeIndex;
};

function useStoryAudioState (storyItems: StoryItemResponse[]): UseStoryAudioResult {
  const [audioMap, setAudioMap] = useState<Record<number, string>>({});
  const [playingItemId, setPlayingItemId] = useState<number | null>(null);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState(-1);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

  useEffect(() => {
    if (playbackStatus !== 'playing') {
      return;
    }

    const syncActiveTimestamp = () => {
      const currentTime = audioRef.current?.currentTime || 0;
      const activeItem = storyItems.find((item) => item.id === playingItemId);

      setActiveTimestampIndex((currentIndex) => {
        const nextIndex = getActiveTimestampIndex(activeItem?.timestamps, currentTime);

        return currentIndex === nextIndex ? currentIndex : nextIndex;
      });
    };

    syncActiveTimestamp();
    const intervalId = window.setInterval(syncActiveTimestamp, 40);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [playbackStatus, playingItemId, storyItems]);

  useEffect(() => {
    const voiceItems = storyItems.filter((item) => item.id != null && item.voiceId);
    const abortController = new AbortController();
    const objectUrls: string[] = [];

    const loadStoryAudios = async () => {
      if (voiceItems.length === 0) {
        setAudioMap((currentAudioMap) => {
          Object.values(currentAudioMap).forEach((url) => URL.revokeObjectURL(url));
          return {};
        });
        return;
      }

      const results = await Promise.allSettled(
        voiceItems.map(async (item) => {
          const response = await fetch(`${apiBaseUrl}/Mobile/Files/${item.voiceId}`, {
            signal: abortController.signal,
          });

          if (!response.ok) {
            throw new Error(`Failed to load audio for story item ${item.id}`);
          }

          const objectUrl = URL.createObjectURL(await response.blob());
          objectUrls.push(objectUrl);

          return [item.id as number, objectUrl] as const;
        }),
      );

      if (abortController.signal.aborted) {
        return;
      }

      const nextAudioMap = results.reduce<Record<number, string>>((audioUrls, result) => {
        if (result.status === 'fulfilled') {
          const [itemId, objectUrl] = result.value;
          audioUrls[itemId] = objectUrl;
        }

        return audioUrls;
      }, {});

      setAudioMap((currentAudioMap) => {
        Object.values(currentAudioMap).forEach((url) => URL.revokeObjectURL(url));
        return nextAudioMap;
      });
    };

    loadStoryAudios().catch((err) => {
      if (!abortController.signal.aborted) {
        console.error('Failed to load story item audios:', err);
      }
    });

    return () => {
      abortController.abort();
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [apiBaseUrl, storyItems]);

  const playableItemIds = useMemo(
    () => storyItems
      .filter((item) => item.id != null && audioMap[item.id])
      .map((item) => item.id as number),
    [audioMap, storyItems],
  );

  const progressPercentage = audioDuration > 0
    ? Math.min((audioProgress / audioDuration) * 100, 100)
    : 0;

  const playItemAudio = async (itemId: number, startTime = 0) => {
    const audioUrl = audioMap[itemId];

    if (!audioUrl || !audioRef.current) {
      return;
    }

    setPlayingItemId(itemId);
    setPlaybackStatus('playing');
    setActiveTimestampIndex(getActiveTimestampIndex(storyItems.find((item) => item.id === itemId)?.timestamps, startTime));
    audioRef.current.pause();

    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    audioRef.current.currentTime = startTime;
    setAudioProgress(startTime);

    try {
      await audioRef.current.play();
      audioRef.current.playbackRate = 1;
    } catch (err) {
      setPlaybackStatus('paused');
      setActiveTimestampIndex(-1);
      console.error('Failed to play story item audio:', err);
    }
  };

  const play = async () => {
    if (!audioRef.current || playableItemIds.length === 0) {
      return;
    }

    if (playingItemId != null && audioMap[playingItemId]) {
      const resumeTime = audioRef.current.src ? audioRef.current.currentTime : audioProgress;
      await playItemAudio(playingItemId, resumeTime);
      return;
    }

    await playItemAudio(playableItemIds[0]);
  };

  const pause = () => {
    if (!audioRef.current) {
      return;
    }

    setAudioProgress(audioRef.current.currentTime);
    setActiveTimestampIndex(-1);
    setPlaybackStatus('paused');
    audioRef.current.pause();
  };

  const restart = async () => {
    if (playableItemIds.length === 0) {
      return;
    }

    setAudioProgress(0);
    setAudioDuration(0);
    await playItemAudio(playableItemIds[0]);
  };

  const playNextItem = async () => {
    if (playableItemIds.length === 0) {
      return;
    }

    const currentIndex = playingItemId == null
      ? -1
      : playableItemIds.indexOf(playingItemId);
    const nextItemId = playableItemIds[currentIndex + 1] ?? playableItemIds[0];

    await playItemAudio(nextItemId);
  };

  const playPreviousItem = async () => {
    if (playableItemIds.length === 0) {
      return;
    }

    const currentIndex = playingItemId == null
      ? 0
      : playableItemIds.indexOf(playingItemId);
    const previousItemId = playableItemIds[currentIndex - 1] ?? playableItemIds[playableItemIds.length - 1];

    await playItemAudio(previousItemId);
  };

  const handleAudioEnded = () => {
    if (playingItemId == null) {
      setPlaybackStatus('idle');
      setActiveTimestampIndex(-1);
      return;
    }

    const currentIndex = playableItemIds.indexOf(playingItemId);
    const nextItemId = playableItemIds[currentIndex + 1];

    if (nextItemId != null) {
      void playItemAudio(nextItemId);
      return;
    }

    setPlaybackStatus('idle');
    setPlayingItemId(null);
    setActiveTimestampIndex(-1);
    setAudioProgress(0);
  };

  const handleLoadedMetadata = () => {
    setAudioDuration(audioRef.current?.duration || 0);
  };

  const handlePause = () => {
    if (audioRef.current?.ended) {
      setPlaybackStatus('idle');
      setActiveTimestampIndex(-1);
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current?.currentTime || 0;
    const activeItem = storyItems.find((item) => item.id === playingItemId);

    setAudioProgress(currentTime);
    setActiveTimestampIndex(getActiveTimestampIndex(activeItem?.timestamps, currentTime));
  };

  return {
    activeItemId: playingItemId,
    activeTimestampIndex,
    audioProgress,
    audioRef,
    playbackStatus,
    playableItemCount: playableItemIds.length,
    progressPercentage,
    showTranslation,
    onToggleTranslation: () => setShowTranslation((current) => !current),
    hasAudio: (itemId) => itemId != null && Boolean(audioMap[itemId]),
    playItemAudio,
    play,
    pause,
    restart,
    playNextItem,
    playPreviousItem,
    handleAudioEnded,
    handleLoadedMetadata,
    handlePause,
    handleTimeUpdate,
  };
}

export function StoryAudioProvider (props: { storyItems: StoryItemResponse[]; children: ReactNode; }) {
  const storyAudio = useStoryAudioState(props.storyItems);

  return createElement(StoryAudioContext.Provider, { value: storyAudio }, props.children);
}

export function useStoryAudio (): UseStoryAudioResult {
  const storyAudio = useContext(StoryAudioContext);

  if (!storyAudio) {
    throw new Error('useStoryAudio must be used within StoryAudioProvider');
  }

  return storyAudio;
}
