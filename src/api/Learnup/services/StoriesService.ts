/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoryResponse } from '../models/StoryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StoriesService {

    /**
     * @param id 
     * @returns StoryResponse OK
     * @throws ApiError
     */
    public static getStoryById(
id: number,
): CancelablePromise<StoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Stories/{id}',
            path: {
                'id': id,
            },
        });
    }

}
