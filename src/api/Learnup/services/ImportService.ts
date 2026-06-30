/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportGrammarRequest } from '../models/ImportGrammarRequest';
import type { ImportLessonGrammarsResponse } from '../models/ImportLessonGrammarsResponse';
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
     * @param courseId 
     * @param lessonOrder 
     * @param requestBody 
     * @returns number OK
     * @throws ApiError
     */
    public static importStory(
courseId: number,
lessonOrder: number,
requestBody?: StoryRequest,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/stories/{courseId}/{lessonOrder}',
            path: {
                'courseId': courseId,
                'lessonOrder': lessonOrder,
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

    /**
     * @param formData 
     * @returns ImportLessonGrammarsResponse OK
     * @throws ApiError
     */
    public static importLessonGrammars(
formData?: {
File?: Blob;
},
): CancelablePromise<ImportLessonGrammarsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/lesson-grammars',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}
