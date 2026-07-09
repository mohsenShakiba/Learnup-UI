/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StoryItemResponse } from './StoryItemResponse';

export type StoryResponse = {
    id: number;
    title: string;
    description: string | null;
    coverId: string | null;
    duration: number | null;
    isCompleted: boolean;
    items: Array<StoryItemResponse>;
};
