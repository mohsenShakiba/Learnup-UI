import { ReaderConfig } from "./readerTypes";

const READER_CONFIG_STORAGE_KEY = 'reader-config';

const DEFAULT_CONFIG: ReaderConfig = {
    fontSize: 18,
    fontFamily: 'Bookerly',
};


export function loadReaderConfig (): ReaderConfig {
    try {
        const raw = localStorage.getItem(READER_CONFIG_STORAGE_KEY);
        if (!raw) return DEFAULT_CONFIG;
        const parsed = JSON.parse(raw) as Partial<ReaderConfig>;
        return { ...DEFAULT_CONFIG, ...parsed };
    } catch {
        return DEFAULT_CONFIG;
    }
}

export function saveReaderConfig (config: ReaderConfig): void {
    try {
        localStorage.setItem(READER_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {
        // Ignore write failures (e.g. storage disabled or quota exceeded).
    }
}