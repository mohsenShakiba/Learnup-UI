import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StoriesService, type StoryResponse } from '../../api/Learnup';

export default function StoryDetailPage () {
  const params = useParams();
  const storyId = params.id;
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storyId) {
      setError("No Story ID provided in the URL parameters.");
      setLoading(false);
      return;
    }

    const fetchStory = async () => {
      try {
        setLoading(true);
        const fetchedStory = await StoriesService.getMobileStories(parseInt(storyId));
        setStory(fetchedStory);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch story:", err);
        setError("Failed to load story. Please try again later.");
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);
  if (loading) {
    return <div>Loading story...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!story) {
    return <div>Story not found for ID: {storyId}.</div>;
  }

  const storyItems = story.items ?? [];

  return (
    <div className="story-page" style={{ maxWidth: 960, margin: '0 auto', padding: '24px 0' }}>
      <header style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Story ID: {story.id ?? storyId}</p>
        <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.2 }}>
          {story.title || 'Untitled Story'}
        </h1>
      </header>

      <section>
        <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>Story Items</h2>

        {storyItems.length === 0 ? (
          <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280' }}>
            No story items were returned for this story.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {storyItems
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((item, index) => (
                <article
                  key={item.id ?? `${item.order ?? index}-${index}`}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <strong>Item {item.order ?? index + 1}</strong>
                    {item.voiceId ? (
                      <span style={{ color: '#6b7280', fontSize: 13 }}>Voice: {item.voiceId}</span>
                    ) : null}
                  </div>

                  <div style={{ display: 'grid', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Content</div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{item.content || 'No content provided.'}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>
                        Translation
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
                        {item.translation || 'No translation provided.'}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>
    </div>
  );
};
