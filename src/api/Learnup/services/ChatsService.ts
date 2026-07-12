/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatDetailResponse } from '../models/ChatDetailResponse';
import type { ChatQueuedResponse } from '../models/ChatQueuedResponse';
import type { ChatRequest } from '../models/ChatRequest';
import type { ChatSummaryResponse } from '../models/ChatSummaryResponse';
import type { SendAiTextRequest } from '../models/SendAiTextRequest';
import type { SendAiTextResponse } from '../models/SendAiTextResponse';
import type { TokenUsageResponse } from '../models/TokenUsageResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatsService {

    /**
     * @returns ChatSummaryResponse OK
     * @throws ApiError
     */
    public static listChats(): CancelablePromise<Array<ChatSummaryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Chats',
        });
    }

    /**
     * @param id 
     * @returns ChatDetailResponse OK
     * @throws ApiError
     */
    public static getChat(
id: number,
): CancelablePromise<ChatDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Chats/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns SendAiTextResponse OK
     * @throws ApiError
     */
    public static translateWithAi(
requestBody?: SendAiTextRequest,
): CancelablePromise<SendAiTextResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Chats/Translate/Ai',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns ChatQueuedResponse OK
     * @throws ApiError
     */
    public static chatWithAi(
requestBody?: ChatRequest,
): CancelablePromise<ChatQueuedResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Chats/Chat',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns TokenUsageResponse OK
     * @throws ApiError
     */
    public static getAvailableTokenUsage(): CancelablePromise<TokenUsageResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Chats/TokenUsage',
        });
    }

}
