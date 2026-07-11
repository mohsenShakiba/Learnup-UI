/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatDetailResponse } from '../models/ChatDetailResponse';
import type { ChatSummaryResponse } from '../models/ChatSummaryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatsService {

    /**
     * @returns ChatSummaryResponse OK
     * @throws ApiError
     */
    public static startChat(): CancelablePromise<ChatSummaryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Chats',
        });
    }

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

}
