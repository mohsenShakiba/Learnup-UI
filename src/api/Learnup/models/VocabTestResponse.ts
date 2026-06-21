/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TestOptionResponse } from './TestOptionResponse';
import type { VocabTestType } from './VocabTestType';

export type VocabTestResponse = {
    id: number;
    vocabId: number;
    question: string;
    type: VocabTestType;
    options: Array<TestOptionResponse>;
    userSelectedOptionId: number | null;
    isCorrect: boolean | null;
};

