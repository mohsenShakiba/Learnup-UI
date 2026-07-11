/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AudioBookItemExpressionResponse } from './AudioBookItemExpressionResponse';

export type AudioBookItemResponse = {
    id: number;
    sentence: string;
    translation: string | null;
    order: number;
    expressions: Array<AudioBookItemExpressionResponse>;
};
