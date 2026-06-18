/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoxLevelResponse } from '../models/BoxLevelResponse';
import type { LeitnerBoxResponse } from '../models/LeitnerBoxResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LeitnerBoxService {

    /**
     * @returns LeitnerBoxResponse OK
     * @throws ApiError
     */
    public static getLeitnerBox(): CancelablePromise<LeitnerBoxResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/LeitnerBox',
        });
    }

    /**
     * @param vocabId 
     * @returns any OK
     * @throws ApiError
     */
    public static addVocabToLeitnerBox(
vocabId: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/LeitnerBox/vocab/{vocabId}',
            path: {
                'vocabId': vocabId,
            },
        });
    }

    /**
     * @returns BoxLevelResponse OK
     * @throws ApiError
     */
    public static getBoxLevelsInfo(): CancelablePromise<BoxLevelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/LeitnerBox/box-level',
        });
    }

}
