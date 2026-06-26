/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportGrammarRequest } from '../models/ImportGrammarRequest';
import type { ImportVocabsResponse } from '../models/ImportVocabsResponse';
import type { StoryRequest } from '../models/StoryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ImportService {

    /**
     * @param formData
     * @returns ImportVocabsResponse OK
     * @throws ApiError
     */
    public static importVocabs(
        formData?: {
            File?: Blob;
            LevelId?: number;
            LanguageId?: number;
        },
    ): CancelablePromise<ImportVocabsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/vocabs',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @param lessonId
     * @param requestBody
     * @returns number OK
     * @throws ApiError
     */
    public static importStory(
        lessonId: number,
        requestBody?: StoryRequest,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/stories/{lessonId}',
            path: {
                'lessonId': lessonId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns number OK
     * @throws ApiError
     */
    public static postAdminImportGrammars(
        requestBody?: ImportGrammarRequest,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/grammars',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
