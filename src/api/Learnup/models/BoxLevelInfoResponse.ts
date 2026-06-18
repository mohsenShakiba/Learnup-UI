/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Level } from './Level';

export type BoxLevelInfoResponse = {
    id: number;
    level: Level;
    willReviewedIn: string;
    itemsCount: number;
    dueItemsCount: number;
    nextReviewAt: string | null;
};
