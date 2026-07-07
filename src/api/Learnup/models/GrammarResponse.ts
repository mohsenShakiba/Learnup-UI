/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrammarLessonResponse } from './GrammarLessonResponse';
import type { VocabLevel } from './VocabLevel';

export type GrammarResponse = {
    id: number;
    name: string;
    level: VocabLevel;
    order: number;
    duration: number;
    description: string;
    parentGrammarId: number | null;
    prerequisiteGrammarIds: Array<number>;
    lessons: Array<GrammarLessonResponse>;
};
