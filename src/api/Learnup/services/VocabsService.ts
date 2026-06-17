/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VocabResponse } from '../models/VocabResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VocabsService {

    /**
     * @param word 
     * @returns VocabResponse OK
     * @throws ApiError
     */
    public static getVocabByWord(
word: string,
): CancelablePromise<VocabResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Vocabs/{word}',
            path: {
                'word': word,
            },
        });
    }

}
