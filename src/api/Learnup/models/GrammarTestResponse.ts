/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TestOptionResponse } from './TestOptionResponse';

export type GrammarTestResponse = {
    id: number;
    grammarId: number;
    question: string;
    options: Array<TestOptionResponse>;
    userSelectedOptionId: number | null;
    isCorrect: boolean | null;
};
