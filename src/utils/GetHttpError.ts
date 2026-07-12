import { ApiError } from "../api/Learnup";

export function checkError (error: unknown, code: string): boolean {
    if (error instanceof ApiError) {
        return error.body === code;
    }
    return false;
}
