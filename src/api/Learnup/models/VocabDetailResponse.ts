/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabLevel } from './VocabLevel';
import type { VocabTranslationResponse } from './VocabTranslationResponse';

export type VocabDetailResponse = {
    id: number;
    word: string;
    translation: string | null;
    voiceId: string | null;
    description: string | null;
    level: VocabLevel;
    languageId: number;
    languageName: string;
    translations: Array<VocabTranslationResponse>;
};
