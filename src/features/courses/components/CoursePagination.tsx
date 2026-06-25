import { Box, Stack } from '@mui/material';

type CoursePaginationProps = {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
};

export function CoursePagination({ count, activeIndex, onDotClick }: CoursePaginationProps) {
  return (
    <Stack
      direction='row'
      spacing={1}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        py: 1.5,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === activeIndex;
        return (
          <Box
            key={i}
            onClick={() => onDotClick(i)}
            sx={(theme) => ({
              width: isActive ? 24 : 8,
              height: 8,
              borderRadius: 4,
              cursor: 'pointer',
              opacity: !isActive ? 0.2 : 1,
              backgroundColor: isActive
                ? theme.palette.primary.main
                : theme.palette.primary.main,
              boxShadow: isActive
                ? `0 0 8px ${theme.palette.primary.main}`
                : 'none',
              transition: theme.transitions.create(['width', 'background-color', 'box-shadow'], {
                duration: theme.transitions.duration.standard,
              }),
            })}
          />
        );
      })}
    </Stack>
  );
}
