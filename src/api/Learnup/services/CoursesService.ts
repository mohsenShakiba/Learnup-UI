/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseResponse } from '../models/CourseResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CoursesService {

    /**
     * @param languageId
     * @returns CourseResponse OK
     * @throws ApiError
     */
    public static getCoursesByLanguageId(
        languageId: number,
    ): CancelablePromise<Array<CourseResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Courses/language/{languageId}',
            path: {
                'languageId': languageId,
            },
        });
    }

    /**
     * @param id
     * @returns CourseResponse OK
     * @throws ApiError
     */
    public static getCourseById(
        id: number,
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Courses/{id}',
            path: {
                'id': id,
            },
        });
    }

}
