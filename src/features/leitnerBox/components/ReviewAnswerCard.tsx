import { Box, Card, Chip, Divider, Icon, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { DueLeitnerBoxItemResponse } from "../../../api/Learnup";
import { VocabType } from "../../../api/Learnup";
import { VocabPlayButton } from "../../vocabs/components/VocabPlayButton";

const VOCAB_TYPE_LABELS: Record<VocabType, string> = {
  [VocabType.UNKNOWN]: "",
  [VocabType.NOUN]: "noun",
  [VocabType.VERB]: "verb",
  [VocabType.ADJECTIVE]: "adjective",
  [VocabType.ADVERB]: "adverb",
};

const VOCAB_TYPE_COLORS: Record<
  VocabType,
  "default" | "primary" | "secondary" | "success" | "warning"
> = {
  [VocabType.UNKNOWN]: "default",
  [VocabType.NOUN]: "primary",
  [VocabType.VERB]: "secondary",
  [VocabType.ADJECTIVE]: "success",
  [VocabType.ADVERB]: "warning",
};

type ReviewAnswerCardProps = {
  card: DueLeitnerBoxItemResponse;
  isPending: boolean;
  onHide: () => void;
};

type DetailBlockProps = {
  icon: string;
  label: string;
  children: ReactNode;
  direction?: "ltr" | "rtl";
};

function DetailBlock ({
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
      <Typography component="div" sx={{ direction, lineHeight: 1.7 }}>
        {children}
      </Typography>
    </Box>
  );
}

export function ReviewAnswerCard ({
  card,
  isPending,
  onHide,
}: ReviewAnswerCardProps) {
  const hasDetails =
    Boolean(card.description?.trim()) || card.senses.length > 0;

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
          {card.voiceId && (
            <Box onClick={(event) => event.stopPropagation()}>
              <VocabPlayButton voiceId={card.voiceId} />
            </Box>
          )}
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

            {card.senses.map((sense) => {
              const typeLabel = VOCAB_TYPE_LABELS[sense.type];
              const typeColor = VOCAB_TYPE_COLORS[sense.type];

              return (
                <Box
                  key={sense.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 1.5,
                    bgcolor: "background.default",
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack
                      direction="row"
                      sx={{ alignItems: "center", gap: 1, direction: "rtl" }}
                    >
                      {typeLabel && (
                        <Chip
                          label={typeLabel}
                          size="small"
                          variant="filled"
                          color={typeColor}
                          sx={{ height: 20, fontSize: 12 }}
                        />
                      )}
                      {sense.translation && (
                        <Typography
                          variant="body2"
                          sx={{ direction: "ltr", fontWeight: 700 }}
                        >
                          {sense.translation}
                        </Typography>
                      )}
                    </Stack>

                    {sense.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", direction: "rtl" }}
                      >
                        {sense.description}
                      </Typography>
                    )}

                    {(sense.example || sense.exampleTranslation) && (
                      <Stack
                        spacing={0.75}
                        sx={{
                          borderTop: "1px solid",
                          borderColor: "divider",
                          pt: 1.25,
                        }}
                      >
                        {sense.example && (
                          <Stack direction="row" spacing={1}>
                            <Icon sx={{ fontSize: 18, color: "text.secondary" }}>
                              format_quote
                            </Icon>
                            <Typography
                              variant="body2"
                              sx={{ fontStyle: "italic", direction: "rtl" }}
                            >
                              {sense.example}
                            </Typography>
                          </Stack>
                        )}

                        {sense.exampleTranslation && (
                          <Stack direction="row" spacing={1}>
                            <Icon sx={{ fontSize: 18, color: "text.secondary" }}>
                              translate
                            </Icon>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", direction: "rtl" }}
                            >
                              {sense.exampleTranslation}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Box>
              );
            })}
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
