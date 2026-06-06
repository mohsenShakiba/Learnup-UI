import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StoriesService, type StoryResponse } from '../../api/Learnup';
import { EmptyList } from '../../shared/components/EmptyList';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { StoryControls, type PlaybackStatus } from './components/StoryControls';
import { StoryItem } from './components/StoryItem';

export default function StoryDetailPage () {
  const params = useParams();
  const storyId = params.id;
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioMap, setAudioMap] = useState<Record<number, string>>({});
  const [playingItemId, setPlayingItemId] = useState<number | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

  useEffect(() => {
    return () => {
      Object.values(audioMap).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [audioMap]);

  useEffect(() => {
    if (!storyId) {
      return;
    }

    const fetchStory = async () => {
      try {
        setLoading(true);
        const fetchedStory = await StoriesService.getStoryById(parseInt(storyId));
        setStory(fetchedStory);
        setError(null);
      } catch (err) {
        console.error("Filed to fetch story:", err);
        setError("Failed to load story. Please try again later.");
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    const storyItems = story?.items ?? [];
    const voiceItems = storyItems.filter((item) => item.id != null && item.voiceId);

    const abortController = new AbortController();
    const objectUrls: string[] = [];

    const loadStoryAudios = async () => {
      if (voiceItems.length === 0) {
        setAudioMap({});
        return;
      }

      const results = await Promise.allSettled(
        voiceItems.map(async (item) => {
          const voiceFileUrl = `${apiBaseUrl}/Mobile/Files/${item.voiceId}`;
          const response = await fetch(voiceFileUrl, { signal: abortController.signal });

          if (!response.ok) {
            throw new Error(`Failed to load audio for story item ${item.id}`);
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          objectUrls.push(objectUrl);

          return [item.id as number, objectUrl] as const;
        }),
      );

      if (abortController.signal.aborted) {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      const nextAudioMap: Record<number, string> = {};

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const [itemId, objectUrl] = result.value;
          nextAudioMap[itemId] = objectUrl;
        }
      });

      setAudioMap((currentAudioMap) => {
        Object.values(currentAudioMap).forEach((url) => {
          if (!Object.values(nextAudioMap).includes(url)) {
            URL.revokeObjectURL(url);
          }
        });

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
  }, [apiBaseUrl, story]);

  const storyItems = (story?.items ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const playableItemIds = storyItems
    .filter((item) => item.id != null && audioMap[item.id])
    .map((item) => item.id as number);
  const activeItemId = playingItemId;
  const progressPercentage = audioDuration > 0 ? Math.min((audioProgress / audioDuration) * 100, 100) : 0;

  const playItemAudio = async (itemId: number, startTime = 0) => {
    const audioUrl = audioMap[itemId];

    if (!audioUrl || !audioRef.current) {
      return;
    }

    setPlayingItemId(itemId);
    setPlaybackStatus('playing');
    audioRef.current.pause();

    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    audioRef.current.currentTime = startTime;

    try {
      await audioRef.current.play();
    } catch (err) {
      setPlaybackStatus('paused');
      console.error('Failed to play story item audio:', err);
    }
  };

  const handlePlay = async () => {
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

  const handlePause = () => {
    if (!audioRef.current) {
      return;
    }

    setAudioProgress(audioRef.current.currentTime);
    setPlaybackStatus('paused');
    audioRef.current.pause();
  };

  const handleRestart = async () => {
    if (playableItemIds.length === 0) {
      return;
    }

    setAudioProgress(0);
    setAudioDuration(0);
    await playItemAudio(playableItemIds[0]);
  };

  const handleAudioEnded = () => {
    if (playingItemId == null) {
      setPlaybackStatus('idle');
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
    setAudioProgress(0);
  };

  if (!storyId) {
    return <ErrorPage message="No Story ID provided in the URL parameters." />;
  }

  if (loading) {
    return <div>Loading story...</div>;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (!story) {
    return <div>Story not found for ID: {storyId}.</div>;
  }

  return (
    <div className="story-page" style={{ maxWidth: 960, margin: '0 auto', padding: '24px 0 120px' }}>
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => setAudioProgress(audioRef.current?.currentTime || 0)}
        onPause={() => {
          if (audioRef.current?.ended) {
            setPlaybackStatus('idle');
          }
        }}
      />
      <header style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Story ID: {story.id ?? storyId}</p>
        <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.2 }}>
          {story.title || 'Untitled Story'}
        </h1>
      </header>

      <section>
        <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>Story Items</h2>

        {storyItems.length === 0 ? (
          <EmptyList message="No story items were returned for this story." />
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {storyItems.map((item, index) => (
              <StoryItem
                key={item.id ?? `${item.order ?? index}-${index}`}
                item={item}
                index={index}
                isActive={item.id === activeItemId}
                hasAudio={item.id != null && Boolean(audioMap[item.id])}
                onPlay={(itemId) => void playItemAudio(itemId)}
              />
            ))}
          </div>
        )}
      </section>

      <StoryControls
        activeItemId={activeItemId}
        playbackStatus={playbackStatus}
        playableItemCount={playableItemIds.length}
        progressPercentage={progressPercentage}
        onPlay={() => void handlePlay()}
        onPause={handlePause}
        onRestart={() => void handleRestart()}
      />
    </div>
  );
};
