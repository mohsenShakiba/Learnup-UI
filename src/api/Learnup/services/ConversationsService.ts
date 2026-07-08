/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConversationDetailResponse } from '../models/ConversationDetailResponse';
import type { ConversationResponse } from '../models/ConversationResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConversationsService {

    /**
     * @returns ConversationResponse OK
     * @throws ApiError
     */
    public static startConversation(): CancelablePromise<ConversationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Conversations',
        });
    }

    /**
     * @returns ConversationResponse OK
     * @throws ApiError
     */
    public static listConversations(): CancelablePromise<Array<ConversationResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Conversations',
        });
    }

    /**
     * @param id
     * @returns ConversationDetailResponse OK
     * @throws ApiError
     */
    public static getConversation(
        id: number,
    ): CancelablePromise<ConversationDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Conversations/{id}',
            path: {
                'id': id,
            },
        });
    }

}
