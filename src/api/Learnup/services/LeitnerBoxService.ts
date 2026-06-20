/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoxLevelResponse } from '../models/BoxLevelResponse';
import type { DueLeitnerBoxItemResponse } from '../models/DueLeitnerBoxItemResponse';
import type { LeitnerBoxResponse } from '../models/LeitnerBoxResponse';
import type { UpdateBoxLevelReviewIntervalRequest } from '../models/UpdateBoxLevelReviewIntervalRequest';

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

    /**
     * @param id
     * @returns DueLeitnerBoxItemResponse OK
     * @throws ApiError
     */
    public static getDueWordsByBoxLevelId(
        id: number,
    ): CancelablePromise<Array<DueLeitnerBoxItemResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/LeitnerBox/box-level/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param boxId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static updateBoxLevelReviewIntervals(
        boxId: number,
        requestBody?: Array<UpdateBoxLevelReviewIntervalRequest>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/LeitnerBox/box-level/review-interval/{boxId}',
            path: {
                'boxId': boxId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
