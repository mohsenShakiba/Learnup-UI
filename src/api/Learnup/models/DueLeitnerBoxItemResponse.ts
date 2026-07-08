/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabSenseResponse } from './VocabSenseResponse';

export type DueLeitnerBoxItemResponse = {
    id: number;
    vocabId: number;
    word: string;
    translation: string | null;
    description: string | null;
    voiceId: string | null;
    senses: Array<VocabSenseResponse>;
    nextReviewAt: string | null;
};

