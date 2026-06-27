/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubscriptionDuration } from './SubscriptionDuration';
import type { SubscriptionFeatureResponse } from './SubscriptionFeatureResponse';
import type { SubscriptionType } from './SubscriptionType';

export type SubscriptionResponse = {
    id: number;
    title: string;
    description: string;
    type: SubscriptionType;
    duration: SubscriptionDuration;
    price: number;
    discountPercent: number;
    isActive: boolean;
    features: Array<SubscriptionFeatureResponse>;
};
