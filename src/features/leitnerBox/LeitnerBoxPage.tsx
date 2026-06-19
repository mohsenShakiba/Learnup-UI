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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { BoxLevelCard } from "./components/BoxLevelCard";

function parseReviewedDays(value: string): string {
  const match = value.match(/-?\d+/);
  return match ? match[0] : "";
}

export default function LeitnerBoxPage() {
  const queryClient = useQueryClient();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [reviewIntervals, setReviewIntervals] = useState<
    Record<number, string>
  >({});
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const leitnerBoxQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
  });

  const updateReviewIntervalsMutation = useMutation({
    mutationFn: (payload: Record<number, string>) =>
      LeitnerBoxService.updateBoxLevelReviewIntervals(
        leitnerBoxQuery.data!.id,
        levels.map((level) => ({
          levelId: level.id,
          number: Number(payload[level.id]),
        })),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["leitner-box-levels"] });
      setShowSavedMessage(true);
      setIsSettingsOpen(false);
    },
    onError: () => {
      setShowErrorMessage(true);
    },
  });

  const levels = useMemo(
    () =>
      [...(leitnerBoxQuery.data?.levels ?? [])].sort(
        (left, right) => Number(left.level) - Number(right.level),
      ),
    [leitnerBoxQuery.data?.levels],
  );

  useEffect(() => {
    setReviewIntervals(
      Object.fromEntries(
        levels.map((level) => [
          level.id,
          parseReviewedDays(level.willReviewedIn),
        ]),
      ),
    );
  }, [levels]);

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

  if (leitnerBoxQuery.isLoading) {
    return <AppLoader />;
  }

  if (leitnerBoxQuery.isError || !leitnerBoxQuery.data) {
    return <ErrorPage onAction={() => void leitnerBoxQuery.refetch()} />;
  }

  const totalItems = levels.reduce((sum, level) => sum + level.itemsCount, 0);

  const handleSave = () => {
    if (!leitnerBoxQuery.data || updateReviewIntervalsMutation.isPending) {
      return;
    }

    updateReviewIntervalsMutation.mutate(reviewIntervals);
  };

  return (
    <Scaffold
      header={
        <DefaultHeader header="Leitner Box" subtitle={`${totalItems} words`}>
          <IconButton
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open Leitner box settings"
          >
            <Icon>settings</Icon>
          </IconButton>
        </DefaultHeader>
      }
    >
      <Stack spacing={2}>
        {levels.length === 0 ? (
          <EmptyList message="No words in your Leitner box yet. Saved vocabulary will appear here and be grouped by level." />
        ) : (
          levels.map((level) => (
            <BoxLevelCard
              key={level.id}
              levelId={level.id}
              level={Number(level.level)}
              totalItems={level.itemsCount}
              readyToReview={level.dueItemsCount}
            />
          ))
        )}
      </Stack>

      <Drawer
        anchor="right"
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      >
        <Stack sx={{ width: { xs: 320, sm: 380 }, p: 2.5 }} spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="h6">Box Settings</Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton
              onClick={() => setIsSettingsOpen(false)}
              aria-label="Close settings"
            >
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
    </Scaffold>
  );
}
