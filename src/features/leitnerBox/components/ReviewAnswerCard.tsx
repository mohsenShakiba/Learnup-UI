import { Box, Card, Divider, Icon, Stack, Typography } from "@mui/material";
import type { DueLeitnerBoxItemResponse } from "../../../api/Learnup";

type ReviewAnswerCardProps = {
  card: DueLeitnerBoxItemResponse;
  isPending: boolean;
  onHide: () => void;
};

type DetailBlockProps = {
  icon: string;
  label: string;
  children: string;
  direction?: "ltr" | "rtl";
};

function DetailBlock({
  icon,
  label,
  children,
  direction = "ltr",
}: DetailBlockProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 1.5,
        bgcolor: "background.default",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", mb: 0.75 }}
      >
        <Icon sx={{ fontSize: 18, color: "text.secondary" }}>{icon}</Icon>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontWeight: 700 }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ direction, lineHeight: 1.7 }}>{children}</Typography>
    </Box>
  );
}

export function ReviewAnswerCard({
  card,
  isPending,
  onHide,
}: ReviewAnswerCardProps) {
  const hasDetails =
    Boolean(card.description?.trim()) ||
    Boolean(card.example?.trim()) ||
    Boolean(card.exampleTranslation?.trim());

  return (
    <Card
      onClick={onHide}
      sx={{
        height: "100%",
        borderRadius: 4,
        cursor: isPending ? "progress" : "pointer",
        mt: 1,
        p: 2,
      }}
    >
      <Stack spacing={2.25} sx={{ minHeight: 280 }}>
        <Stack spacing={1.2} sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography variant="overline" color="text.secondary">
            Answer
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {card.translation || "No translation available"}
          </Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
            {card.word}
          </Typography>
        </Stack>

        <Divider />

        {hasDetails ? (
          <Stack spacing={1.25}>
            {card.description?.trim() && (
              <DetailBlock icon="notes" label="Meaning" direction="rtl">
                {card.description}
              </DetailBlock>
            )}

            {card.example?.trim() && (
              <DetailBlock icon="format_quote" label="Example sentence">
                {card.example}
              </DetailBlock>
            )}

            {card.exampleTranslation?.trim() && (
              <DetailBlock
                icon="translate"
                label="Example translation"
                direction="rtl"
              >
                {card.exampleTranslation}
              </DetailBlock>
            )}
          </Stack>
        ) : (
          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              color: "text.secondary",
              bgcolor: "background.default",
            }}
          >
            <Typography>No extra details for this word.</Typography>
          </Box>
        )}

        <Typography
          variant="caption"
          sx={{ mt: "auto", color: "text.secondary", textAlign: "center" }}
        >
          Choose how well you remembered it.
        </Typography>
      </Stack>
    </Card>
  );
}
