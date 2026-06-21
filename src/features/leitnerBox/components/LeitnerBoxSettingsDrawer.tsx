import {
  Box,
  Button,
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

function parseReviewedDays(value: string): string {
  const match = value.match(/-?\d+/);
  if (match[0] === "00") {
    return "0";
  }
  return match ? match[0] : "";
}

export function LeitnerBoxSettingsDrawer({
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
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="h6">Box Settings</Typography>
              <Box sx={{ flex: 1 }} />
              <IconButton onClick={onClose} aria-label="Close settings">
                <Icon>close</Icon>
              </IconButton>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Set how many days each box should wait before review.
            </Typography>
          </Stack>

          <Stack
            spacing={2}
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 2.5,
              pt: 1,
            }}
          >
            {levels.map((level) => (
              <TextField
                label={`Level ${Number(level.level)}`}
                type="text"
                value={reviewIntervals[level.id] ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/[^\d]/g, "");
                  setReviewIntervals((current) => ({
                    ...current,
                    [level.id]: nextValue,
                  }));
                }}
                error={invalidLevelIds.has(level.id)}
                helperText={
                  invalidLevelIds.has(level.id)
                    ? "Enter a valid number of days."
                    : `Current value: ${level.willReviewedIn}`
                }
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    dir: "ltr",
                  },
                }}
                fullWidth
              />
            ))}
          </Stack>

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
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
              sx={{ minWidth: 160 }}
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
