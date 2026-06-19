/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionResponse } from '../models/SubscriptionResponse';
import type { UserSubscriptionResponse } from '../models/UserSubscriptionResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SubscriptionsService {

    /**
     * @returns SubscriptionResponse OK
     * @throws ApiError
     */
    public static getSubscriptions(): CancelablePromise<Array<SubscriptionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Subscriptions',
        });
    }

    /**
     * @returns UserSubscriptionResponse OK
     * @throws ApiError
     */
    public static getUserCurrentSubscription(): CancelablePromise<UserSubscriptionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Mobile/Subscriptions/me',
        });
    }

}
