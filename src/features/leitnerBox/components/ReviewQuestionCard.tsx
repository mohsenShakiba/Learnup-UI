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
        minHeight: 320,
        borderRadius: 4,
        cursor: isPending ? "progress" : "pointer",
        p: 2,
        mt: 3,
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          height: "100%",
          minHeight: 280,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Word
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {card.word}
        </Typography>

        <Typography sx={{ direction: "rtl" }} color="text.secondary">
          Tap the card to reveal the answer.
        </Typography>
      </Stack>
    </Card>
  );
}
