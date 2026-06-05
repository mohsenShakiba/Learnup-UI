/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocalLevel } from './VocalLevel';

export type VocabResponse = {
    id?: number;
    word?: string | null;
    translation?: string | null;
    voiceId?: string | null;
    description?: string | null;
    level?: VocalLevel;
    parentVocabId?: number | null;
    languageId?: number;
};
