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
import type { ConversationItemResponse } from '../../../api/Learnup';
import { getFileById } from '../../../services/fetchFile';

export type PlaybackStatus = 'idle' | 'playing' | 'paused';

/** A single word with its start/end offset (seconds) inside the conversation audio. */
type WordTimestamp = {
  text: string;
  start: number;
  end: number;
};

/** The time range (seconds) a conversation item occupies inside the conversation audio. */
export type ConversationSegment = {
  itemId: number;
  start: number;
  end: number;
};

type UseConversationAudioResult = {
  activeItemId: number | null;
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

const ConversationAudioContext = createContext<UseConversationAudioResult | null>(null);

/** Small epsilon (seconds) to make time comparisons tolerant of float drift. */
const TIME_EPSILON = 0.01;

/**
 * Aligns the flat word-timestamp list against the ordered conversation items to work
 * out the time range each item occupies. Words are assigned to items in order:
 * an item consumes as many words as its content has whitespace-separated tokens.
 * An item's end is the next item's start (so playback flows continuously); the
 * final item keeps its last word's end time.
 */
function buildSegments (conversationItems: ConversationItemResponse[], words: WordTimestamp[]): ConversationSegment[] {
  const orderedItems = [...conversationItems]
    .filter((item) => item.id != null)
    .sort((first, second) => first.order - second.order);

  const segments: ConversationSegment[] = [];
  let wordIndex = 0;

  for (const item of orderedItems) {
    const tokenCount = item.content.trim().split(/\s+/).filter(Boolean).length;

    if (tokenCount === 0 || wordIndex >= words.length) {
      continue;
    }

    const start = words[wordIndex].start;
    const lastWordIndex = Math.min(wordIndex + tokenCount, words.length) - 1;
    const end = words[lastWordIndex].end;
    wordIndex = lastWordIndex + 1;

    segments.push({ itemId: item.id as number, start, end });
  }

  for (let index = 0; index < segments.length - 1; index += 1) {
    segments[index].end = segments[index + 1].start;
  }

  return segments;
}

function useConversationAudioState (conversationId: number, conversationItems: ConversationItemResponse[]): UseConversationAudioResult {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [words, setWords] = useState<WordTimestamp[]>([]);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!Number.isFinite(conversationId)) {
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const loadConversationAudio = async () => {
      const [audioBuffer, wordsBuffer] = await Promise.all([
        getFileById(`conversation_voices/${conversationId}.mp3`),
        getFileById(`conversation_voices/${conversationId}.json`),
      ]);

      if (cancelled) {
        return;
      }

      objectUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/mpeg' }));

      const parsed = JSON.parse(new TextDecoder().decode(wordsBuffer)) as { words?: WordTimestamp[]; };

      setAudioUrl(objectUrl);
      setWords(Array.isArray(parsed.words) ? parsed.words : []);
    };

    loadConversationAudio().catch((err) => {
      if (!cancelled) {
        console.error('Failed to load conversation audio:', err);
      }
    });

    return () => {
      cancelled = true;
      setAudioUrl(null);
      setWords([]);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [conversationId]);

  const segments = useMemo(() => buildSegments(conversationItems, words), [conversationItems, words]);

  const segmentByItemId = useMemo(() => {
    const map = new Map<number, ConversationSegment>();
    segments.forEach((segment) => map.set(segment.itemId, segment));
    return map;
  }, [segments]);

  const progressPercentage = audioDuration > 0
    ? Math.min((audioProgress / audioDuration) * 100, 100)
    : 0;

  /** Returns the last segment whose start is at or before the given time. */
  const segmentAtTime = (time: number): ConversationSegment | null => {
    let match: ConversationSegment | null = null;

    for (const segment of segments) {
      if (time + TIME_EPSILON >= segment.start) {
        match = segment;
      } else {
        break;
      }
    }

    return match;
  };

  const playFromTime = async (startTime: number, itemId: number | null) => {
    if (!audioUrl || !audioRef.current) {
      return;
    }

    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    setActiveItemId(itemId);
    setPlaybackStatus('playing');
    audioRef.current.currentTime = startTime;
    setAudioProgress(startTime);

    try {
      await audioRef.current.play();
    } catch (err) {
      setPlaybackStatus('paused');
      console.error('Failed to play conversation audio:', err);
    }
  };

  const playItemAudio = async (itemId: number) => {
    const segment = segmentByItemId.get(itemId);

    if (!segment) {
      return;
    }

    await playFromTime(segment.start, itemId);
  };

  const play = async () => {
    if (!audioUrl || !audioRef.current || segments.length === 0) {
      return;
    }

    if (playbackStatus === 'paused' && audioRef.current.src) {
      setPlaybackStatus('playing');

      try {
        await audioRef.current.play();
      } catch (err) {
        setPlaybackStatus('paused');
        console.error('Failed to resume conversation audio:', err);
      }

      return;
    }

    await playFromTime(segments[0].start, segments[0].itemId);
  };

  const pause = () => {
    if (!audioRef.current) {
      return;
    }

    setAudioProgress(audioRef.current.currentTime);
    setPlaybackStatus('paused');
    audioRef.current.pause();
  };

  const restart = async () => {
    if (segments.length === 0) {
      return;
    }

    await playFromTime(segments[0].start, segments[0].itemId);
  };

  const playNextItem = async () => {
    if (segments.length === 0) {
      return;
    }

    const currentIndex = activeItemId == null
      ? -1
      : segments.findIndex((segment) => segment.itemId === activeItemId);
    const nextSegment = segments[currentIndex + 1] ?? segments[0];

    await playFromTime(nextSegment.start, nextSegment.itemId);
  };

  const playPreviousItem = async () => {
    if (segments.length === 0) {
      return;
    }

    const currentIndex = activeItemId == null
      ? 0
      : segments.findIndex((segment) => segment.itemId === activeItemId);
    const previousSegment = segments[currentIndex - 1] ?? segments[segments.length - 1];

    await playFromTime(previousSegment.start, previousSegment.itemId);
  };

  const handleAudioEnded = () => {
    setPlaybackStatus('idle');
    setActiveItemId(null);
    setAudioProgress(0);
  };

  const handleLoadedMetadata = () => {
    setAudioDuration(audioRef.current?.duration || 0);
  };

  const handlePause = () => {
    if (audioRef.current?.ended) {
      setPlaybackStatus('idle');
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current?.currentTime || 0;

    setAudioProgress(currentTime);

    const segment = segmentAtTime(currentTime);

    if (segment && segment.itemId !== activeItemId) {
      setActiveItemId(segment.itemId);
    }
  };

  return {
    activeItemId,
    audioProgress,
    audioRef,
    playbackStatus,
    playableItemCount: segments.length,
    progressPercentage,
    showTranslation,
    onToggleTranslation: () => setShowTranslation((current) => !current),
    hasAudio: (itemId) => itemId != null && segmentByItemId.has(itemId),
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

export function ConversationAudioProvider (props: { conversationId: number; conversationItems: ConversationItemResponse[]; children: ReactNode; }) {
  const conversationAudio = useConversationAudioState(props.conversationId, props.conversationItems);

  return createElement(ConversationAudioContext.Provider, { value: conversationAudio }, props.children);
}

export function useConversationAudio (): UseConversationAudioResult {
  const conversationAudio = useContext(ConversationAudioContext);

  if (!conversationAudio) {
    throw new Error('useConversationAudio must be used within ConversationAudioProvider');
  }

  return conversationAudio;
}
