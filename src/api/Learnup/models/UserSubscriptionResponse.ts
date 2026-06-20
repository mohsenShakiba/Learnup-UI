/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubscriptionDuration } from './SubscriptionDuration';
import type { SubscriptionType } from './SubscriptionType';
import type { UserSubscriptionStatus } from './UserSubscriptionStatus';

export type UserSubscriptionResponse = {
    id: number;
    subscriptionId: number;
    subscriptionTitle: string;
    subscriptionType: SubscriptionType;
    duration: SubscriptionDuration;
    startedAt: string;
    expiresAt: string;
    status: UserSubscriptionStatus;
};

