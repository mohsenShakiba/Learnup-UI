/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabResponse } from './VocabResponse';
import type { VocalLevel } from './VocalLevel';

export type VocabDetailResponse = {
    id: number;
    word: string;
    translation: string | null;
    voiceId: string | null;
    description: string | null;
    level: VocalLevel;
    parentVocab: VocabResponse;
    languageId: number;
    languageName: string;
};
