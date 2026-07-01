/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PlacementOptionResponse } from './PlacementOptionResponse';
import type { PlacementSkill } from './PlacementSkill';

export type PlacementQuestionResponse = {
    id: number;
    number: number;
    level: string;
    skill: PlacementSkill;
    prompt: string;
    options: Array<PlacementOptionResponse>;
};
