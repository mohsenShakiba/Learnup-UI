import {
  Box,
  Button,
  Drawer,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { LeitnerBoxService } from "../../../api/Learnup";
import { BoxLevelResponse } from "../../../api/Learnup/models/BoxLevelResponse";
import { toast } from "../../../shared/toast/toastStore";

function parseReviewedDays(value: string): string {
  const match = value.match(/-?\d+/);
  return match ? match[0] : "";
}

interface Props {
  open: boolean;
  onClose: () => void;
  leitnerBox: BoxLevelResponse;
}

export function LeitnerBoxSettingsDrawer({ open, onClose, leitnerBox }: Props) {
  const queryClient = useQueryClient();

  const levels = useMemo(
    () =>
      [...(leitnerBox.levels ?? [])].sort(
        (left, right) => Number(left.level) - Number(right.level),
      ),
    [leitnerBox.levels],
  );

  const [reviewIntervals, setReviewIntervals] = useState<Record<number, string>>(
    () =>
      Object.fromEntries(
        levels.map((level) => [level.id, parseReviewedDays(level.willReviewedIn)]),
      ),
  );

  useEffect(() => {
    setReviewIntervals(
      Object.fromEntries(
        levels.map((level) => [level.id, parseReviewedDays(level.willReviewedIn)]),
      ),
    );
  }, [levels]);

  const invalidLevelIds = useMemo(
    () =>
      new Set(
        levels
          .filter((level) => {
            const value = reviewIntervals[level.id]?.trim() ?? "";
            return value === "" || Number.isNaN(Number(value)) || Number(value) < 0;
          })
          .map((level) => level.id),
      ),
    [levels, reviewIntervals],
  );

  const updateReviewIntervalsMutation = useMutation({
    mutationFn: () =>
      LeitnerBoxService.updateBoxLevelReviewIntervals(
        leitnerBox.id,
        levels.map((level) => ({
          levelId: level.id,
          number: Number(reviewIntervals[level.id]),
        })),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["leitner-box-levels"] });
      onClose();
      toast.success("Box level settings updated.");
    },
    onError: () => {
      toast.error("Failed to update box level settings.");
    },
  });

  const handleSave = () => {
    if (updateReviewIntervalsMutation.isPending) return;
    updateReviewIntervalsMutation.mutate();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Stack sx={{ width: { xs: 320, sm: 380 }, p: 2.5 }} spacing={2}>
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

        {levels.map((level) => (
          <TextField
            key={level.id}
            label={`Level ${Number(level.level)}`}
            type="number"
            value={reviewIntervals[level.id] ?? ""}
            onChange={(event) =>
              setReviewIntervals((current) => ({
                ...current,
                [level.id]: event.target.value,
              }))
            }
            error={invalidLevelIds.has(level.id)}
            helperText={
              invalidLevelIds.has(level.id)
                ? "Enter a valid number of days."
                : `Current value: ${level.willReviewedIn}`
            }
            slotProps={{
              htmlInput: { min: 0, step: 1 },
            }}
            fullWidth
          />
        ))}

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            invalidLevelIds.size > 0 ||
            levels.length === 0 ||
            updateReviewIntervalsMutation.isPending
          }
        >
          {updateReviewIntervalsMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Drawer>
  );
}
