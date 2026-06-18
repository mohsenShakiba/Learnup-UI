/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerTestRequest } from '../models/AnswerTestRequest';
import type { AnswerTestResponse } from '../models/AnswerTestResponse';
import type { GrammarTestResponse } from '../models/GrammarTestResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GrammarTestsService {

    /**
     * @param lessonId 
     * @returns GrammarTestResponse OK
     * @throws ApiError
     */
    public static getGrammarTests(
lessonId: number,
): CancelablePromise<Array<GrammarTestResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/GrammarTests/lesson/{lessonId}',
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
    public static answerGrammarTest(
id: number,
requestBody?: AnswerTestRequest,
): CancelablePromise<AnswerTestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/GrammarTests/{id}/answer',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns any OK
     * @throws ApiError
     */
    public static resetGrammarTestResult(
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/GrammarTests/{id}/reset',
            path: {
                'id': id,
            },
        });
    }

}
