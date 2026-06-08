/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StoryItemResponse } from './StoryItemResponse';

export type StoryResponse = {
    id: number;
    title: string;
    coverId: number | null;
    items: Array<StoryItemResponse>;
};
