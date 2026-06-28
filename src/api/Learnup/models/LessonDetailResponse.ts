/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrammarResponse } from './GrammarResponse';
import type { StoryResponse } from './StoryResponse';
import type { TestResponse } from './TestResponse';
import type { UserLessonResponse } from './UserLessonResponse';
import type { VocabResponse } from './VocabResponse';

export type LessonDetailResponse = {
    id: number;
    title: string;
    order: number;
    courseId: number;
    nextLessonId: number | null;
    userLesson: UserLessonResponse;
    stories: Array<StoryResponse>;
    grammars: Array<GrammarResponse>;
    vocabs: Array<VocabResponse>;
    tests: Array<TestResponse>;
};
