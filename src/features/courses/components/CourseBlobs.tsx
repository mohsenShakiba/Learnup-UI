import { Box } from "@mui/material";

/** Decorative animated blobs rendered behind the course code. Purely visual. */
export function CourseBlobs () {
  return (
    <>
      <Box aria-hidden sx={{
        position: 'absolute',
        right: 5,
        top: -10,
        width: 140,
        height: 140,
        bgcolor: 'primary.main',
        opacity: 0.07,
        zIndex: 0,
        borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
        animation: 'courseBlobA 22s ease-in-out infinite',
        '@keyframes courseBlobA': {
          '0%, 100%': {
            borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
            transform: 'rotate(0deg) scale(1)',
          },
          '20%': {
            borderRadius: '67% 33% 41% 59% / 58% 41% 59% 42%',
            transform: 'rotate(6deg) scale(1.04)',
          },
          '40%': {
            borderRadius: '38% 62% 71% 29% / 63% 34% 66% 37%',
            transform: 'rotate(14deg) scale(1.07)',
          },
          '60%': {
            borderRadius: '59% 41% 32% 68% / 44% 62% 38% 56%',
            transform: 'rotate(9deg) scale(1.02)',
          },
          '80%': {
            borderRadius: '48% 52% 57% 43% / 36% 55% 45% 64%',
            transform: 'rotate(-5deg) scale(1.05)',
          },
        },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }} />
      <Box aria-hidden sx={{
        position: 'absolute',
        right: 90,
        bottom: 10,
        width: 80,
        height: 80,
        bgcolor: 'primary.main',
        opacity: 0.05,
        zIndex: 0,
        borderRadius: '63% 37% 44% 56% / 49% 55% 45% 51%',
        animation: 'courseBlobB 18s ease-in-out infinite',
        '@keyframes courseBlobB': {
          '0%, 100%': {
            borderRadius: '63% 37% 44% 56% / 49% 55% 45% 51%',
            transform: 'translateY(0) rotate(0deg) scale(1)',
          },
          '25%': {
            borderRadius: '34% 66% 61% 39% / 62% 38% 63% 37%',
            transform: 'translateY(-5px) rotate(-9deg) scale(1.06)',
          },
          '50%': {
            borderRadius: '37% 63% 56% 44% / 55% 45% 55% 45%',
            transform: 'translateY(-8px) rotate(-14deg) scale(1.03)',
          },
          '75%': {
            borderRadius: '58% 42% 33% 67% / 41% 58% 43% 60%',
            transform: 'translateY(-3px) rotate(-4deg) scale(1.05)',
          },
        },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }} />
    </>
  );
}
