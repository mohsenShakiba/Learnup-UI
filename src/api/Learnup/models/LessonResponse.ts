/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LessonStatus } from './LessonStatus';

export type LessonResponse = {
    id?: number;
    title?: string | null;
    order?: number;
    status?: LessonStatus;
    courseId?: number;
};
