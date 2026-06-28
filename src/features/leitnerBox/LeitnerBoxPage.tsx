import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { BoxLevelCard } from "./components/BoxLevelCard";
import { LeitnerBoxSettingsDrawer } from "./components/LeitnerBoxSettingsDrawer";

export default function LeitnerBoxPage () {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const leitnerBoxQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
    refetchOnMount: "always",
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

  const totalItems = levels.reduce((sum, level) => sum + level.itemsCount, 0);

  return (
    <Scaffold
      header={
        <DefaultHeader
          header="مرور"
          children={
            <IconButton onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          }
        />
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

      <LeitnerBoxSettingsDrawer
        boxId={leitnerBoxQuery.data.id}
        levels={levels}
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Scaffold>
  );
}
