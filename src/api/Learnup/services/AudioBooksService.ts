/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AudioBookDetailResponse } from '../models/AudioBookDetailResponse';
import type { AudioBookResponse } from '../models/AudioBookResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AudioBooksService {

    /**
     * @returns AudioBookResponse OK
     * @throws ApiError
     */
    public static getMobileAudioBooks(): CancelablePromise<Array<AudioBookResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/AudioBooks',
        });
    }

    /**
     * @param id 
     * @returns AudioBookDetailResponse OK
     * @throws ApiError
     */
    public static getAudioBookById(
id: number,
): CancelablePromise<AudioBookDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/AudioBooks/{id}',
            path: {
                'id': id,
            },
        });
    }

}
