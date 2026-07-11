/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConversationItemResponse } from './ConversationItemResponse';

export type ConversationResponse = {
    id: number;
    title: string;
    description: string | null;
    duration: number | null;
    isCompleted: boolean;
    items: Array<ConversationItemResponse>;
};
