import { useEffect, useRef } from 'react';
import { LessonsService, UserLessonStatus } from '../../../api/Learnup';

/**
 * Notifies the backend that a lesson section has been completed. The call fires
 * once per (lessonId, section) as soon as `ready` becomes true, so callers can
 * gate it on data being loaded or a test being finished.
 */
export function useSectionCompleted (
  lessonId: number | null | undefined,
  status: UserLessonStatus,
  ready: boolean = true,
) {
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!ready || notifiedRef.current) return;
    if (lessonId == null || !Number.isFinite(lessonId)) return;

    notifiedRef.current = true;
    LessonsService.onLessonSectionCompleted(lessonId, status).catch((err) => {
      console.error('Failed to report lesson section completion:', err);
    });
  }, [lessonId, status, ready]);
}
