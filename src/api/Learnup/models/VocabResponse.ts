/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VocabLevel } from './VocabLevel';
import type { VocabSenseResponse } from './VocabSenseResponse';

export type VocabResponse = {
    id: number;
    word: string;
    translation: string | null;
    voiceId: string | null;
    description: string | null;
    level: VocabLevel;
    isInLeitnerBox: boolean;
    senses: Array<VocabSenseResponse>;
};

