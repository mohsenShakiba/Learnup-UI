/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerTestRequest } from '../models/AnswerTestRequest';
import type { AnswerTestResponse } from '../models/AnswerTestResponse';
import type { TestType } from '../models/TestType';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TestsService {

    /**
     * @param id 
     * @param requestBody 
     * @returns AnswerTestResponse OK
     * @throws ApiError
     */
    public static answerTest(
id: number,
requestBody?: AnswerTestRequest,
): CancelablePromise<AnswerTestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Tests/{id}/answer',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param lessonId 
     * @param type 
     * @returns any OK
     * @throws ApiError
     */
    public static resetTestResult(
lessonId: number,
type?: TestType,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Tests/lesson/{lessonId}/reset',
            path: {
                'lessonId': lessonId,
            },
            query: {
                'type': type,
            },
        });
    }

}
