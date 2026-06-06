import { Link } from 'react-router-dom';
import type { LessonResponse } from '../../../api/Learnup';

type LessonListItemProps = {
  lesson: LessonResponse;
};

export function LessonListItem ({ lesson }: LessonListItemProps) {
  return (
    <li>
      <Link to={`/lessons/${lesson.id}`}>{lesson.title ?? `Lesson ${lesson.id}`}</Link>
    </li>
  );
}
