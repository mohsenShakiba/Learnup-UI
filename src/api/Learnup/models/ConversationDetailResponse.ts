/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ChatMessageResponse } from './ChatMessageResponse';

export type ConversationDetailResponse = {
    id: number;
    title: string | null;
    createdAt: string;
    updatedAt: string;
    messages: Array<ChatMessageResponse>;
};

