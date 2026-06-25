import { useMemo, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { BoxLevelCard } from "./components/BoxLevelCard";
import {
  hasTutorialBeenSeen,
  LeitnerBoxTutorialCard,
} from "./components/LeitnerBoxTutorialCard";
import { LeitnerBoxSettingsDrawer } from "./components/LeitnerBoxSettingsDrawer";

export default function LeitnerBoxPage() {

  const [showTutorial, setShowTutorial] = useState(() => !hasTutorialBeenSeen());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const leitnerBoxQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
  });

  const levels = useMemo(
    () =>
      [...(leitnerBoxQuery.data?.levels ?? [])].sort(
        (left, right) => Number(left.level) - Number(right.level),
      ),
    [leitnerBoxQuery.data?.levels],
  );

  if (leitnerBoxQuery.isLoading) {
    return <AppLoader />;
  }

  if (leitnerBoxQuery.isError || !leitnerBoxQuery.data) {
    return <ErrorPage onAction={() => void leitnerBoxQuery.refetch()} />;
  }

  return (
    <Scaffold>

      <Stack direction='row' sx={{ alignItems: 'end', pb: 2 }}>
        <Typography sx={{ px: 2 }} variant='body1'>لایتنر باکس</Typography>
        <Box sx={{ flex: 1 }} />
      </Stack>

      {showTutorial ? (
        <LeitnerBoxTutorialCard onDismiss={() => setShowTutorial(false)} />
      ) : (
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
      )}

      <LeitnerBoxSettingsDrawer
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        leitnerBox={leitnerBoxQuery.data}
      />
    </Scaffold>
  );
}
