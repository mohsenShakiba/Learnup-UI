/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserStatus } from './UserStatus';

export type UserProfileResponse = {
    id: number;
    displayName: string;
    avatarUrl: string | null;
    createdAt: string;
    lastLogin: string | null;
    status: UserStatus;
};

