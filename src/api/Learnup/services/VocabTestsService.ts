/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerTestRequest } from '../models/AnswerTestRequest';
import type { AnswerTestResponse } from '../models/AnswerTestResponse';
import type { VocabTestResponse } from '../models/VocabTestResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VocabTestsService {

    /**
     * @param lessonId
     * @returns VocabTestResponse OK
     * @throws ApiError
     */
    public static getVocabTests(
        lessonId: number,
    ): CancelablePromise<Array<VocabTestResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/VocabTests/lesson/{lessonId}',
            path: {
                'lessonId': lessonId,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns AnswerTestResponse OK
     * @throws ApiError
     */
    public static answerVocabTest(
        id: number,
        requestBody?: AnswerTestRequest,
    ): CancelablePromise<AnswerTestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/VocabTests/{id}/answer',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param lessonId
     * @returns any OK
     * @throws ApiError
     */
    public static resetVocabTestResult(
        lessonId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/VocabTests/{lessonId}/reset',
            path: {
                'lessonId': lessonId,
            },
        });
    }

}
