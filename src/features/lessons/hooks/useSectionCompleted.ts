import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { LessonsService, UserLessonStatus } from '../../../api/Learnup';

/**
 * Notifies the backend that a lesson section has been completed. The call fires
 * once per (lessonId, section) as soon as `ready` becomes true, so callers can
 * gate it on data being loaded or a test being finished. On success the lesson
 * query is invalidated so the detail page reflects the new progress without a
 * reload.
 */
export function useSectionCompleted (
  lessonId: number | null | undefined,
  status: UserLessonStatus,
  ready: boolean = true,
) {
  const queryClient = useQueryClient();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!ready || notifiedRef.current) return;
    if (lessonId == null || !Number.isFinite(lessonId)) return;

    notifiedRef.current = true;
    LessonsService.onLessonSectionCompleted(lessonId, status)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      })
      .catch((err) => {
        console.error('Failed to report lesson section completion:', err);
      });
  }, [lessonId, status, ready, queryClient]);
}
