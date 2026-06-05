/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StoryItemRequest } from './StoryItemRequest';

export type StoryRequest = {
    title?: string | null;
    words?: Array<string> | null;
    sentences?: Array<StoryItemRequest> | null;
};
