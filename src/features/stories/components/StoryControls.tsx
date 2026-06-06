export type PlaybackStatus = 'idle' | 'playing' | 'paused';

type StoryControlsProps = {
  activeItemId: number | null;
  playbackStatus: PlaybackStatus;
  playableItemCount: number;
  progressPercentage: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
};

export function StoryControls ({
  activeItemId,
  playbackStatus,
  playableItemCount,
  progressPercentage,
  onPlay,
  onPause,
  onRestart,
}: StoryControlsProps) {
  const isPlaying = playbackStatus === 'playing';
  const hasPlayableItems = playableItemCount > 0;

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        left: 24,
        zIndex: 20,
        maxWidth: 960,
        margin: '0 auto',
        padding: 16,
        border: '1px solid #dbeafe',
        borderRadius: 16,
        background: 'rgba(255, 255, 255, 0.94)',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {activeItemId != null ? `Playing item ${activeItemId}` : 'Ready to play story'}
          </div>
          <div style={{ marginTop: 4, fontWeight: 700, color: '#111827' }}>
            {isPlaying ? 'Story playback in progress' : 'Story controls'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onPlay}
            disabled={isPlaying || !hasPlayableItems}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '10px 16px',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              cursor: isPlaying || !hasPlayableItems ? 'not-allowed' : 'pointer',
              opacity: isPlaying || !hasPlayableItems ? 0.55 : 1,
            }}
          >
            Play
          </button>
          <button
            type="button"
            onClick={onPause}
            disabled={!isPlaying}
            style={{
              border: '1px solid #bfdbfe',
              borderRadius: 999,
              padding: '10px 16px',
              background: '#fff',
              color: '#1d4ed8',
              fontWeight: 700,
              cursor: !isPlaying ? 'not-allowed' : 'pointer',
              opacity: !isPlaying ? 0.55 : 1,
            }}
          >
            Pause
          </button>
          <button
            type="button"
            onClick={onRestart}
            disabled={!hasPlayableItems}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 999,
              padding: '10px 16px',
              background: '#f9fafb',
              color: '#374151',
              fontWeight: 700,
              cursor: !hasPlayableItems ? 'not-allowed' : 'pointer',
              opacity: !hasPlayableItems ? 0.55 : 1,
            }}
          >
            Restart
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14, height: 8, overflow: 'hidden', borderRadius: 999, background: '#e5e7eb' }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            borderRadius: 999,
            background: '#2563eb',
            transition: 'width 120ms linear',
          }}
        />
      </div>
    </div>
  );
}
