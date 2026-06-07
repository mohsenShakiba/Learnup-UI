/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrammarResponse } from './GrammarResponse';
import type { StoryResponse } from './StoryResponse';
import type { VocabResponse } from './VocabResponse';

export type LessonDetailResponse = {
    id?: number;
    title?: string | null;
    order?: number;
    courseId?: number;
    storyIds?: Array<StoryResponse> | null;
    grammarIds?: Array<GrammarResponse> | null;
    vocabIds?: Array<VocabResponse> | null;
};
