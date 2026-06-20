/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrammarLessonRequest } from './GrammarLessonRequest';

export type GrammarRequest = {
    name: string;
    levelId: number;
    order: number;
    estimatedTimeMinutes: number;
    description: string;
    parentGrammarId: number | null;
    lessons: Array<GrammarLessonRequest>;
};

