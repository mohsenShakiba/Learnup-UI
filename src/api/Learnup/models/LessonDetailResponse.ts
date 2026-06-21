/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrammarResponse } from './GrammarResponse';
import type { LessonVocabTestResponse } from './LessonVocabTestResponse';
import type { StoryResponse } from './StoryResponse';
import type { VocabResponse } from './VocabResponse';

export type LessonDetailResponse = {
    id: number;
    title: string;
    order: number;
    courseId: number;
    stories: Array<StoryResponse>;
    grammars: Array<GrammarResponse>;
    vocabs: Array<VocabResponse>;
    vocabTest: LessonVocabTestResponse;
};

