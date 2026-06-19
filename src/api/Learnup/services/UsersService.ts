/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserStreakResponse } from '../models/UserStreakResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

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

}
