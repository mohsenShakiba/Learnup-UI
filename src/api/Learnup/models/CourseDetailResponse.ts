/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CourseLessonResponse } from './CourseLessonResponse';

export type CourseDetailResponse = {
    id?: number;
    title?: string | null;
    order?: number;
    languageId?: number;
    lessons?: Array<CourseLessonResponse> | null;
};
