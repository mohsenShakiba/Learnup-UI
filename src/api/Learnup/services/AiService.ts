/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SendAiTextRequest } from '../models/SendAiTextRequest';
import type { SendAiTextResponse } from '../models/SendAiTextResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AiService {

    /**
     * @param requestBody
     * @returns SendAiTextResponse OK
     * @throws ApiError
     */
    public static postMobileAiProcess(
        requestBody?: SendAiTextRequest,
    ): CancelablePromise<SendAiTextResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Ai/Process',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
