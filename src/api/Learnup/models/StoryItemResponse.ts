/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StoryItemTimestampResponse } from './StoryItemTimestampResponse';

export type StoryItemResponse = {
    id: number;
    content: string;
    translation: string;
    order: number;
    person: number;
    voiceId: string | null;
    timestamps: Array<StoryItemTimestampResponse>;
};

