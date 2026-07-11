/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConversationItemExpressionResponse } from '../models/ConversationItemExpressionResponse';
import type { ConversationResponse } from '../models/ConversationResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConversationsService {

    /**
     * @param id 
     * @returns ConversationResponse OK
     * @throws ApiError
     */
    public static getConversationById(
id: number,
): CancelablePromise<ConversationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Conversations/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @param itemId 
     * @returns ConversationItemExpressionResponse OK
     * @throws ApiError
     */
    public static getConversationItemExpressions(
id: number,
itemId: number,
): CancelablePromise<Array<ConversationItemExpressionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Conversations/{id}/items/{itemId}/expressions',
            path: {
                'id': id,
                'itemId': itemId,
            },
        });
    }

}
