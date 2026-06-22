import Epub from "epubjs";

export interface TotalPageCalculation {
    offsets: number[];
    totalPages: number;
}

// epub.js' bundled types don't expose the per-section page info we need.
export interface SectionLocation {
    index: number;
    cfi?: string;
    displayed: { page: number; total: number; };
}

export async function calculateTotalPages (
    book: ReturnType<typeof Epub>,
    viewer: HTMLDivElement,
    isCancelled: () => boolean,
): Promise<TotalPageCalculation | null> {
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    if (!width || !height) return null;

    const measureContainer = document.createElement('div');
    measureContainer.style.cssText =
        `position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;` +
        `width:${width}px;height:${height}px;overflow:hidden;opacity: 0`;
    document.body.appendChild(measureContainer);

    const measureRendition = book.renderTo(measureContainer, {
        flow: 'paginated',
        manager: 'continuous',
        width,
        height,
    });

    try {
        const spineItems = (book.spine as unknown as {
            spineItems: Array<{ href: string; index: number; }>;
        }).spineItems;

        const offsets: number[] = [];
        let cumulative = 0;

        for (const item of spineItems) {
            if (isCancelled()) return null;
            await measureRendition.display(item.href);
            const start = (measureRendition.location as unknown as { start?: SectionLocation; })?.start;
            offsets[item.index] = cumulative;
            cumulative += start?.displayed.total ?? 1;
        }

        if (isCancelled()) return null;

        return { offsets, totalPages: cumulative };
    } finally {
        measureRendition.destroy();
        measureContainer.remove();
    }
}