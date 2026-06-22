/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserBookResponse } from '../models/UserBookResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserBooksService {

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
            url: '/Mobile/UserBooks',
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
            url: '/Mobile/UserBooks',
        });
    }

    /**
     * @param name 
     * @returns any OK
     * @throws ApiError
     */
    public static getUserBookFile(
name: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/UserBooks/book/{name}',
            path: {
                'name': name,
            },
        });
    }

}
