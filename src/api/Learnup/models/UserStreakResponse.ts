/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserStreakDayResponse } from './UserStreakDayResponse';

export type UserStreakResponse = {
    currentStreak: number;
    lastStreakDate: string | null;
    lastVisitedAt: string | null;
    lastSevenDays: Array<UserStreakDayResponse>;
};
