export interface TotalPageCalculation {
    offsets: number[];
    totalPages: number;
}

export interface SectionLocation {
    index: number;
    cfi?: string;
    href?: string;
    fraction?: number;
    size?: number;
    tocItem?: { href?: string; label?: string; };
    pageItem?: { label?: string; };
}
