import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  AnswerQuality,
  type DueLeitnerBoxItemResponse,
  VocabType,
} from "../../../api/Learnup";
import { AppIcon } from "../../../shared/components/AppIcon";
import { VocabPlayButton } from "../../vocabs/components/VocabPlayButton";

const VOCAB_TYPE_LABELS: Record<VocabType, string> = {
  [VocabType.UNKNOWN]: "",
  [VocabType.NOUN]: "اسم",
  [VocabType.VERB]: "فعل",
  [VocabType.ADJECTIVE]: "صفت",
  [VocabType.ADVERB]: "قید",
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

type ReviewAnswerPanelProps = {
  card: DueLeitnerBoxItemResponse;
  disabled: boolean;
  isPending: boolean;
  onHide: () => void;
  onMainAction: () => void;
  onQualitySelect: (quality: AnswerQuality) => void;
  onRemove: () => void;
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

export function ReviewAnswerPanel ({
  card,
  disabled,
  isPending,
  onHide,
  onMainAction,
  onQualitySelect,
  onRemove,
}: ReviewAnswerPanelProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const hasDetails =
    Boolean(card.description?.trim()) || card.senses.length > 0;

  function handleMenuSelect (action: () => void) {
    setMenuAnchor(null);
    action();
  }

  return (
    <Stack spacing={1.5} sx={{ px: 2, pb: 3 }}>
      <Card
        onClick={onHide}
        sx={{
          height: "100%",
          borderRadius: 1,
          cursor: isPending ? "progress" : "pointer",
          p: 2,
        }}
      >
        <Stack spacing={2.25}>
          <Stack
            spacing={1.2}
            sx={{ textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="overline" color="text.secondary">
              ترجمه
            </Typography>
            {card.voiceId && (
              <Box onClick={(event) => event.stopPropagation()}>
                <VocabPlayButton voiceId={card.voiceId} />
              </Box>
            )}
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {card.translation || "ترجمه‌ای موجود نیست"}
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              {card.word}
            </Typography>
          </Stack>

          <Divider />

          {hasDetails ? (
            <Stack spacing={1.25}>
              {card.description?.trim() && (
                <DetailBlock icon="notes" label="معنی" direction="rtl">
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
                        sx={{
                          alignItems: "center",
                          gap: 1,
                          direction: "rtl",
                        }}
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
                              <Icon
                                sx={{ fontSize: 18, color: "text.secondary" }}
                              >
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
                              <Icon
                                sx={{ fontSize: 18, color: "text.secondary" }}
                              >
                                translate
                              </Icon>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                  direction: "rtl",
                                }}
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
              <Typography>جزئیات بیشتری برای این واژه موجود نیست.</Typography>
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{ mt: "auto", color: "text.secondary", textAlign: "center" }}
          >
            برای ادامه، از دکمه‌ی پایین استفاده کنید.
          </Typography>
        </Stack>
      </Card>

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={onMainAction}
          sx={{
            flex: 1,
            borderRadius: 1,
          }}
        >
          انتقال به سطح بعد
        </Button>

        <IconButton
          aria-label="گزینه‌های بیشتر"
          disabled={disabled}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <AppIcon>more_vert</AppIcon>
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          slotProps={{
            list: { dense: true },
          }}
        >
          <MenuItem
            onClick={() =>
              handleMenuSelect(() => onQualitySelect(AnswerQuality.NO_IDEA))
            }
          >
            <ListItemText>دوباره</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() =>
              handleMenuSelect(() => onQualitySelect(AnswerQuality.HARD))
            }
          >
            <ListItemText>سخت</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() =>
              handleMenuSelect(() =>
                onQualitySelect(AnswerQuality.PEACE_OF_CAKE),
              )
            }
          >
            <ListItemText>خیلی ساده</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => handleMenuSelect(onRemove)}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AppIcon sx={{ color: "error.main", fontSize: 20 }}>
                delete
              </AppIcon>
            </ListItemIcon>
            <ListItemText sx={{ color: "error.main" }}>
              حذف از جعبه
            </ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}
