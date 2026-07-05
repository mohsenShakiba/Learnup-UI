import { Card, Stack, Typography } from "@mui/material";
import type { DueLeitnerBoxItemResponse } from "../../../api/Learnup";

type ReviewQuestionCardProps = {
  card: DueLeitnerBoxItemResponse;
  isPending: boolean;
  onReveal: () => void;
};

export function ReviewQuestionCard({
  card,
  isPending,
  onReveal,
}: ReviewQuestionCardProps) {
  return (
    <Card
      onClick={onReveal}
      sx={{
        height: "100%",
        boxSizing: "border-box",
        borderRadius: 1,
        cursor: isPending ? "progress" : "pointer",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          واژه
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
          {card.word}
        </Typography>
      </Stack>
    </Card>
  );
}
