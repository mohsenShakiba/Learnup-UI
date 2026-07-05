/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteSignupRequest } from '../models/CompleteSignupRequest';
import type { SendOtpRequest } from '../models/SendOtpRequest';
import type { SendOtpResponse } from '../models/SendOtpResponse';
import type { VerifyOtpRequest } from '../models/VerifyOtpRequest';
import type { VerifyOtpResponse } from '../models/VerifyOtpResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @param requestBody
     * @returns SendOtpResponse OK
     * @throws ApiError
     */
    public static sendOtp(
        requestBody?: SendOtpRequest,
    ): CancelablePromise<SendOtpResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Auth/send-otp',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns VerifyOtpResponse OK
     * @throws ApiError
     */
    public static verifyOtp(
        requestBody?: VerifyOtpRequest,
    ): CancelablePromise<VerifyOtpResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Auth/verify-otp',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns VerifyOtpResponse OK
     * @throws ApiError
     */
    public static completeSignup(
        requestBody?: CompleteSignupRequest,
    ): CancelablePromise<VerifyOtpResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Mobile/Auth/complete-signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
