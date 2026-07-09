/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PlacementAnswerReviewResponse } from './PlacementAnswerReviewResponse';

export type PlacementResultResponse = {
    placedLevel: string;
    correctByBand: Record<string, number>;
    startingCourseId: number | null;
    answers: Array<PlacementAnswerReviewResponse>;
};
