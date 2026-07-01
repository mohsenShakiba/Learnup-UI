import {
  Box,
  Button,
  Drawer,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { BoxLevelInfoResponse } from "../../../api/Learnup";
import { LeitnerBoxService } from "../../../api/Learnup";
import { AppIcon } from '../../../shared/components/AppIcon';
import { getLevelTone } from "./levelTone";

type LeitnerBoxSettingsDrawerProps = {
  boxId: number;
  levels: BoxLevelInfoResponse[];
  open: boolean;
  onClose: () => void;
};

const LEVEL_HARDNESS_LABELS = [
  "Hard",
  "Tough",
  "Tricky",
  "Demanding",
  "Challenging",
  "Uneasy",
  "Moderate",
  "Fair",
  "Familiar",
  "Steady",
  "Solid",
  "Strong",
  "Easy",
  "Fluent",
  "Mastered",
] as const;

function parseReviewedDays (value: string): string {
  const match = value.match(/-?\d+/);
  if (!match) {
    return "";
  }

  if (match[0] === "00") {
    return "0";
  }

  return match[0];
}

export function LeitnerBoxSettingsDrawer ({
  boxId,
  levels,
  open,
  onClose,
}: LeitnerBoxSettingsDrawerProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [reviewIntervals, setReviewIntervals] = useState<
    Record<number, string>
  >({});
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setReviewIntervals(
      Object.fromEntries(
        levels.map((level) => [
          level.id,
          parseReviewedDays(level.willReviewedIn),
        ]),
      ),
    );
  }, [levels, open]);

  const invalidLevelIds = useMemo(
    () =>
      new Set(
        levels
          .filter((level) => {
            const value = reviewIntervals[level.id]?.trim() ?? "";
            return (
              value === "" || Number.isNaN(Number(value)) || Number(value) < 0
            );
          })
          .map((level) => level.id),
      ),
    [levels, reviewIntervals],
  );

  const updateReviewIntervalsMutation = useMutation({
    mutationFn: (payload: Record<number, string>) =>
      LeitnerBoxService.updateBoxLevelReviewIntervals(
        boxId,
        levels.map((level) => ({
          levelId: level.id,
          number: Number(payload[level.id]),
        })),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["leitner-box-levels"] });
      setShowSavedMessage(true);
      onClose();
    },
    onError: () => {
      setShowErrorMessage(true);
    },
  });

  const handleSave = () => {
    if (updateReviewIntervalsMutation.isPending) {
      return;
    }

    updateReviewIntervalsMutation.mutate(reviewIntervals);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: 320, sm: 380 },
            height: "100dvh",
            px: 2.5,
            py: 2,
            bgcolor: "background.paper",
            borderRadius: 0,
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack
            spacing={1.5}
            sx={{
              pb: 2,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="h6">تنظیمات</Typography>
              <Box sx={{ flex: 1 }} />
              <IconButton onClick={onClose} aria-label="Close settings">
                <AppIcon>close</AppIcon>
              </IconButton>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              اینجا می‌تونی برنامه مرور رو بر حسب روز عوض کنی.
            </Typography>
          </Stack>

          <Stack
            spacing={1.2}
            sx={{
              flex: 1,
              overflowY: "auto",
              pt: 1,
            }}
          >
            {levels.map((level) => {
              const levelNumber = Number(level.level);
              const tone = getLevelTone(levelNumber, theme);
              const hardnessLabel =
                LEVEL_HARDNESS_LABELS[levelNumber - 1] ?? "Mastered";

              return (
                <Box
                  key={level.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.35,
                    p: 1.2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <TextField
                    id={`leitner-level-${level.id}`}
                    size="small"
                    type="text"
                    value={reviewIntervals[level.id] ?? ""}
                    onChange={(event) => {
                      const nextValue = event.target.value.replace(
                        /[^\d]/g,
                        "",
                      );
                      setReviewIntervals((current) => ({
                        ...current,
                        [level.id]: nextValue,
                      }));
                    }}
                    error={invalidLevelIds.has(level.id)}
                    placeholder="روز"
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                    }}
                    sx={{
                      width: 76,
                      flex: "0 0 76px",
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                        "& fieldset": {
                          borderColor: "divider",
                        },
                        "&:hover fieldset": {
                          borderColor: "text.secondary",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: tone.color,
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  <Stack
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      gap: 0.55,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.8}
                      sx={{
                        justifyContent: "end",
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          px: 0.85,
                          py: 0.2,
                          borderRadius: 999,
                          bgcolor: tone.softColor,
                          color: tone.color,
                          fontSize: 10,
                          fontWeight: 800,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tone.status}
                      </Box>
                    </Stack>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 11.5,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        overflow: "hidden",
                        textAlign: "right",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {hardnessLabel}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      flex: "0 0 46px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2.25,
                      bgcolor: tone.color,
                      color: "common.white",
                      fontFamily: "Georgia, Merriweather, serif",
                      fontWeight: 800,
                      fontSize: 18,
                    }}
                  >
                    {levelNumber}
                  </Box>
                </Box>
              );
            })}
          </Stack>

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              pt: 2,
              bgcolor: "background.paper",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                invalidLevelIds.size > 0 ||
                levels.length === 0 ||
                updateReviewIntervalsMutation.isPending
              }
              sx={{
                minWidth: "100%",
                borderRadius: 999,
                px: 3,
                boxShadow: "none",
              }}
            >
              {updateReviewIntervalsMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Stack>
      </Drawer>

      <Snackbar
        open={showSavedMessage}
        autoHideDuration={3000}
        onClose={() => setShowSavedMessage(false)}
        message="Box level settings updated."
      />

      <Snackbar
        open={showErrorMessage}
        autoHideDuration={4000}
        onClose={() => setShowErrorMessage(false)}
        message="Failed to update box level settings."
      />
    </>
  );
}
