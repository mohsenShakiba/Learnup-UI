/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TestOptionResponse } from './TestOptionResponse';
import type { TestQuestionType } from './TestQuestionType';
import type { TestType } from './TestType';

export type TestResponse = {
    id: number;
    lessonId: number;
    type: TestType;
    questionType: TestQuestionType;
    question: string;
    options: Array<TestOptionResponse>;
    userSelectedOptionId: number | null;
    isCorrect: boolean | null;
};

