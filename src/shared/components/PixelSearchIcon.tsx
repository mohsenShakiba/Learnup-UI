import { useTheme } from '@mui/material/styles';

// 2px-thick ring, center (6,6), outerR≈5.5, innerR≈3.5, on a 16x16 grid
const PIXELS: [number, number][] = [
  [1,4],[1,5],[1,6],[1,7],[1,8],
  [2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],
  [3,2],[3,3],[3,4],                 [3,8],[3,9],[3,10],
  [4,1],[4,2],[4,3],                 [4,9],[4,10],[4,11],
  [5,1],[5,2],                                   [5,10],[5,11],
  [6,1],[6,2],                                   [6,10],[6,11],
  [7,1],[7,2],                                   [7,10],[7,11],
  [8,1],[8,2],[8,3],                 [8,9],[8,10],[8,11],
  [9,2],[9,3],[9,4],                 [9,8],[9,9],[9,10],
  [10,3],[10,4],[10,5],[10,6],[10,7],[10,8],[10,9],
  [11,4],[11,5],[11,6],[11,7],[11,8],
  // 2px-wide diagonal handle
  [10,10],[10,11],
  [11,11],[11,12],
  [12,12],[12,13],
  [13,13],[13,14],
  [14,14],[14,15],
];

interface Props {
  size?: number;
  color?: string;
}

export function PixelSearchIcon({ size = 64, color }: Props) {
  const theme = useTheme();
  const fill = color ?? theme.palette.text.disabled;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ imageRendering: 'pixelated' }}
      shapeRendering="crispEdges"
    >
      {PIXELS.map(([row, col]) => (
        <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill={fill} />
      ))}
    </svg>
  );
}
