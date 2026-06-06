import type { StoryItemResponse } from '../../../api/Learnup';

type StoryItemProps = {
  item: StoryItemResponse;
  isActive: boolean;
  showTranslation: boolean;
  onPlay: (itemId: number) => void;
};

export function StoryItem ({ item, isActive, showTranslation, onPlay }: StoryItemProps) {
  const itemId = item.id;

  const handlePlay = () => {
    if (itemId != null) {
      onPlay(itemId);
    }
  };

  return (
    <article
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && itemId != null) {
          event.preventDefault();
          onPlay(itemId);
        }
      }}
      style={{
        border: isActive ? '1px solid #2563eb' : '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        background: isActive ? '#eff6ff' : '#fff',
        cursor: 'pointer',
        boxShadow: isActive ? '0 12px 30px rgba(37, 99, 235, 0.14)' : 'none',
        transition: 'background 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <strong>Item {item.order}</strong>
        {item.voiceId ? (
          <span style={{ color: '#6b7280', fontSize: 13 }}>Voice: {item.voiceId}</span>
        ) : null}
      </div>
      <div style={{ marginBottom: 12, fontSize: 13, color: '#2563eb' }}>
        {'Tap to play audio'}
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Content</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{item.content || 'No content provided.'}</div>
        </div>

        {showTranslation ? (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>
              Translation
            </div>
            <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
              {item.translation || 'No translation provided.'}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
