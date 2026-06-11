/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabLevel } from './VocabLevel';
import type { VocabTranslationResponse } from './VocabTranslationResponse';

export type VocabResponse = {
    id: number;
    word: string;
    translation: string | null;
    voiceId: string | null;
    description: string | null;
    level: VocabLevel;
    languageId: number;
    translations: Array<VocabTranslationResponse>;
};
