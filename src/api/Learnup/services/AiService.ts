/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AiService {

    /**
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static postMobileAiSend(
        requestBody?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Ai/send',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
