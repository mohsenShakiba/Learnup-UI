/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabLevel } from './VocabLevel';
import type { VocabStatus } from './VocabStatus';
import type { VocabType } from './VocabType';

export type VocabResponse = {
    id: number;
    word: string;
    translation: string | null;
    voiceId: string | null;
    description: string | null;
    example: string | null;
    exampleTranslation: string | null;
    level: VocabLevel;
    status: VocabStatus;
    type: VocabType;
    languageId: number;
};

