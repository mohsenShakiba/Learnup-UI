/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AudioBookItemResponse } from './AudioBookItemResponse';

export type AudioBookDetailResponse = {
    id: number;
    title: string;
    description: string | null;
    author: string | null;
    level: string | null;
    year: string | null;
    wordCount: string | null;
    source: string | null;
    coverId: string | null;
    voiceId: string | null;
    timingJsonId: string | null;
    isVoiced: boolean;
    items: Array<AudioBookItemResponse>;
};
