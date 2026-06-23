/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateUserBookCurrentPageRequest } from '../models/UpdateUserBookCurrentPageRequest';
import type { UserBookResponse } from '../models/UserBookResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BooksControllersService {

    /**
     * @param formData 
     * @returns UserBookResponse OK
     * @throws ApiError
     */
    public static uploadUserBook(
formData?: {
Title?: string;
File?: Blob;
CoverImage?: Blob;
},
): CancelablePromise<UserBookResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/BooksControllers',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @returns UserBookResponse OK
     * @throws ApiError
     */
    public static getUserBooks(): CancelablePromise<Array<UserBookResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/BooksControllers',
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static updateUserBookProgress(
id: number,
requestBody?: UpdateUserBookCurrentPageRequest,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/Mobile/BooksControllers/book/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
