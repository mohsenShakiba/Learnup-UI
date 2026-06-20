/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GrammarLessonResponse } from '../models/GrammarLessonResponse';
import type { GrammarResponse } from '../models/GrammarResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GrammarsService {

    /**
     * @param id
     * @returns GrammarResponse OK
     * @throws ApiError
     */
    public static getMobileGrammars(
        id: number,
    ): CancelablePromise<GrammarResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Grammars/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns GrammarResponse OK
     * @throws ApiError
     */
    public static getMobileGrammars1(): CancelablePromise<Array<GrammarResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Grammars',
        });
    }

    /**
     * @param grammarId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteMobileGrammars(
        grammarId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/Mobile/Grammars/{grammarId}',
            path: {
                'grammarId': grammarId,
            },
        });
    }

    /**
     * @returns GrammarLessonResponse OK
     * @throws ApiError
     */
    public static getMobileGrammarsLessons(): CancelablePromise<Array<GrammarLessonResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Grammars/lessons',
        });
    }

}
