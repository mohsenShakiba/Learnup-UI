/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MotivationalSentenceResponse } from '../models/MotivationalSentenceResponse';
import type { UpdateProfileRequest } from '../models/UpdateProfileRequest';
import type { UserProfileResponse } from '../models/UserProfileResponse';
import type { UserStreakResponse } from '../models/UserStreakResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * @returns UserProfileResponse OK
     * @throws ApiError
     */
    public static getProfile(): CancelablePromise<UserProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Users/profile',
        });
    }

    /**
     * @param requestBody 
     * @returns UserProfileResponse OK
     * @throws ApiError
     */
    public static updateProfile(
requestBody?: UpdateProfileRequest,
): CancelablePromise<UserProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/Mobile/Users/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param formData 
     * @returns UserProfileResponse OK
     * @throws ApiError
     */
    public static uploadAvatar(
formData?: {
File?: Blob;
},
): CancelablePromise<UserProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Users/profile/avatar',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @returns UserStreakResponse OK
     * @throws ApiError
     */
    public static getUserStreaks(): CancelablePromise<UserStreakResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Users/streak',
        });
    }

    /**
     * @returns MotivationalSentenceResponse OK
     * @throws ApiError
     */
    public static getMotivationalSentence(): CancelablePromise<MotivationalSentenceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Users',
        });
    }

}
