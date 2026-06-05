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

  // Render the story details
  return (
    <div className="story-page">
      <h1>{story.title || "Untitled Story"}</h1>

    </div>
  );
};

