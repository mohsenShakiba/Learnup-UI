import {
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { BoxLevelInfoResponse } from "../../../api/Learnup";
import { LeitnerBoxService } from "../../../api/Learnup";

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

function getLevelBadgeColor (levelIndex: number, totalLevels: number): string {
  if (totalLevels <= 1) {
    return "hsl(145 65% 42%)";
  }

  const ratio = levelIndex / (totalLevels - 1);
  const hue = 145 - ratio * 145;
  return `hsl(${hue} 70% 48%)`;
}

export function LeitnerBoxSettingsDrawer ({
  boxId,
  levels,
  open,
  onClose,
}: LeitnerBoxSettingsDrawerProps) {
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
                <Icon>close</Icon>
              </IconButton>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              اینجا می‌تونی برنامه مرور رو بر حسب روز عوض کنی.
            </Typography>
          </Stack>

          <Stack
            spacing={2}
            divider={<Divider />}
            sx={{
              flex: 1,
              overflowY: "auto",
              pt: 2,
            }}
          >
            {levels.map((level, index) => {
              const badgeColor = getLevelBadgeColor(index, levels.length);
              const levelNumber = Number(level.level);
              const hardnessLabel =
                LEVEL_HARDNESS_LABELS[levelNumber - 1] ?? "Mastered";

              return (
                <Box
                  key={`Level ${levelNumber}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.75,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 0.5,
                    }}
                  >
                    <TextField
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
                        width: "80px",
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "background.paper",
                          "& fieldset": {
                            borderColor: "divider",
                          },
                          "&:hover fieldset": {
                            borderColor: "text.secondary",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: badgeColor,
                            borderWidth: 2,
                          },
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      {hardnessLabel}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      minWidth: 52,
                      height: 52,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1.5,
                      bgcolor: badgeColor,
                      color: "common.white",
                      fontWeight: 700,
                      fontSize: 18,
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "inset 0 0 0 1px rgba(255,255,255,0.12), 0 8px 18px rgba(0,0,0,0.32)"
                          : "inset 0 0 0 1px rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.12)",
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
