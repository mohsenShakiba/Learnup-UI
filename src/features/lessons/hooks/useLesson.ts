import { useQuery } from '@tanstack/react-query';
import { ApiError, LessonsService } from '../../../api/Learnup';

const ACCESS_LIMIT_CODE = "AccessLimit";

function isAccessLimitError (error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.body === ACCESS_LIMIT_CODE;
  }
  return false;
}

/**
 * Loads a lesson detail by id. Shared across the lesson detail page and the
 * pages nested under it (conversations, vocabs, tests) so the lesson is fetched once
 * and reused from the react-query cache.
 */
export function useLesson (lessonId: number) {
  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => LessonsService.getLessonById(lessonId),
    enabled: Number.isFinite(lessonId),
    retry: false,
  });

  return {
    ...lessonQuery,
    isAccessLimitError: lessonQuery.isError && isAccessLimitError(lessonQuery.error),
  };
}
