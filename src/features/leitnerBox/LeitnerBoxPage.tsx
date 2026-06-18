import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { BoxLevelCard } from "./components/BoxLevelCard";

export default function LeitnerBoxPage() {
  const leitnerBoxQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
  });

  if (leitnerBoxQuery.isLoading) {
    return <AppLoader />;
  }

  if (leitnerBoxQuery.isError || !leitnerBoxQuery.data) {
    return <ErrorPage onAction={() => void leitnerBoxQuery.refetch()} />;
  }

  const levels = [...(leitnerBoxQuery.data.levels ?? [])].sort(
    (left, right) => Number(left.level) - Number(right.level),
  );
  const totalItems = levels.reduce((sum, level) => sum + level.itemsCount, 0);

  return (
    <Scaffold
      maxWidth="sm"
      header={
        <DefaultHeader header="Leitner Box" subtitle={`${totalItems} words`} />
      }
    >
      <Stack spacing={2}>
        {levels.length === 0 ? (
          <EmptyList message="No words in your Leitner box yet. Saved vocabulary will appear here and be grouped by level." />
        ) : (
          levels.map((level) => (
            <BoxLevelCard
              key={level.id}
              level={Number(level.level)}
              totalItems={level.itemsCount}
              readyToReview={level.dueItemsCount}
            />
          ))
        )}
      </Stack>
    </Scaffold>
  );
}
