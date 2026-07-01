import { useTheme } from '@mui/material';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

type DotGridProps = {
  /** Distance between dot centers in px. Smaller gap = more dots. */
  gap?: number;
  /** Diameter of each dot in px. */
  dotSize?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
  className?: string;
  zIndex?: number;
};

type Size = { width: number; height: number; };

export function DotGrid ({
  gap = 30,
  dotSize = 3,
  color,
  style,
  className,
  zIndex = -1,
  opacity = 0.1
}: DotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const { palette } = useTheme();

  let dotColor = color;

  if (!dotColor) {
    dotColor = palette.mode === 'dark' ? 'rgba(255,255,255)' : 'rgba(0,0,0)';
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cols = Math.max(1, Math.floor(size.width / gap));
  const rows = Math.max(1, Math.floor(size.height / gap));

  // Spread the dots so the margin at every edge equals half the spacing,
  // keeping the grid visually centered regardless of container size.
  const stepX = size.width / cols;
  const stepY = size.height / rows;

  const dots: { cx: number; cy: number; }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push({
        cx: stepX * (col + 0.5),
        cy: stepY * (row + 0.5),
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden
      style={{
        opacity: opacity ?? 0.1,
        position: 'absolute',
        inset: 0,
        zIndex: zIndex,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {size.width > 0 && size.height > 0 && (
        <svg width={size.width} height={size.height} style={{ display: 'block' }}>
          {dots.map(({ cx, cy }, i) => (
            <circle key={i} cx={cx} cy={cy} r={dotSize / 2} fill={dotColor} />
          ))}
        </svg>
      )}
    </div>
  );
}
