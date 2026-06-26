/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabLevel } from './VocabLevel';
import type { VocabType } from './VocabType';

export type CreateVocabRequest = {
    languageId: number;
    word: string;
    translation: string | null;
    type: VocabType;
    level: VocabLevel;
    description: string | null;
    example: string | null;
    exampleTranslation: string | null;
    voiceId: string | null;
};

