import { useQuery } from '@tanstack/react-query';
import { LessonsService } from '../../../api/Learnup';

/**
 * Loads a lesson detail by id. Shared across the lesson detail page and the
 * pages nested under it (conversations, vocabs, tests) so the lesson is fetched once
 * and reused from the react-query cache.
 */
export function useLesson(lessonId: number) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => LessonsService.getLessonById(lessonId),
    enabled: Number.isFinite(lessonId),
  });
}
