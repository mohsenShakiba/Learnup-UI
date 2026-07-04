/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrentLessonProgressResponse } from '../models/CurrentLessonProgressResponse';
import type { LessonDetailResponse } from '../models/LessonDetailResponse';
import type { LessonResponse } from '../models/LessonResponse';
import type { UserLessonStatus } from '../models/UserLessonStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LessonsService {

    /**
     * @param courseId 
     * @returns LessonResponse OK
     * @throws ApiError
     */
    public static getLessonsByCourseId(
courseId: number,
): CancelablePromise<Array<LessonResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Lessons/course/{courseId}',
            path: {
                'courseId': courseId,
            },
        });
    }

    /**
     * @returns CurrentLessonProgressResponse OK
     * @throws ApiError
     */
    public static getCurrentLessonProgress(): CancelablePromise<CurrentLessonProgressResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Lessons/current',
        });
    }

    /**
     * @param id 
     * @returns LessonDetailResponse OK
     * @throws ApiError
     */
    public static getLessonById(
id: number,
): CancelablePromise<LessonDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Lessons/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @param section 
     * @returns any OK
     * @throws ApiError
     */
    public static onLessonSectionCompleted(
id: number,
section?: UserLessonStatus,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Lessons/{id}/section-completed',
            path: {
                'id': id,
            },
            query: {
                'section': section,
            },
        });
    }

}
