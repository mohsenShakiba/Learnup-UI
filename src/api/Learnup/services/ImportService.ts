/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportGrammarRequest } from '../models/ImportGrammarRequest';
import type { PlacementTestRequest } from '../models/PlacementTestRequest';
import type { StoryRequest } from '../models/StoryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ImportService {

    /**
     * @param formData 
     * @returns number OK
     * @throws ApiError
     */
    public static importVocabs(
formData?: {
File?: Blob;
LevelId?: number;
LanguageId?: number;
},
): CancelablePromise<number> {
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
    public static importPlacementTest(
requestBody?: PlacementTestRequest,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/placement-test',
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
     * @returns number OK
     * @throws ApiError
     */
    public static importLessonGrammars(
formData?: {
File?: Blob;
},
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Admin/Import/lesson-grammars',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}
