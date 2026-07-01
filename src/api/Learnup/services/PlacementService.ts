/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementResultResponse } from '../models/PlacementResultResponse';
import type { PlacementTestResponse } from '../models/PlacementTestResponse';
import type { SubmitPlacementRequest } from '../models/SubmitPlacementRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PlacementService {

    /**
     * @returns PlacementTestResponse OK
     * @throws ApiError
     */
    public static getPlacementTest(): CancelablePromise<PlacementTestResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Placement',
        });
    }

    /**
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static submitPlacementTest(
requestBody?: SubmitPlacementRequest,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Placement/submit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns PlacementResultResponse OK
     * @throws ApiError
     */
    public static getPlacementResult(): CancelablePromise<PlacementResultResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Placement/result',
        });
    }

}
