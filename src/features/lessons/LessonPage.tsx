import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LessonsService, type LessonResponse } from '../../api/Learnup';

export default function LessonPage () {
  const { id: courseId } = useParams<{ id: string; }>();
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('No course ID provided in the URL parameters.');
      setLoading(false);
      return;
    }

    const fetchLessons = async () => {
      try {
        setLoading(true);
        const courseIdNumber = Number(courseId);

        if (Number.isNaN(courseIdNumber)) {
          throw new Error(`Invalid course ID: ${courseId}`);
        }

        const fetchedLessons = await LessonsService.getMobileLessonsCourse(courseIdNumber);
        setLessons(fetchedLessons);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
        setError('Failed to load lessons. Please try again later.');
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (lessons.length === 0) {
    return <div>No lessons found for course ID: {courseId}.</div>;
  }

  return (
    <div className="lesson-page">
      <h1>Course Lessons - {courseId}</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id ?? `${lesson.courseId ?? courseId}-${lesson.order ?? lesson.title ?? 'lesson'}`}>
            <Link to={`/lessons/${lesson.id}`}>{lesson.title ?? `Lesson ${lesson.id}`}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
