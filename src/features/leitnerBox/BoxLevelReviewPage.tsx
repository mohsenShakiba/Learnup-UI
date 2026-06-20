import { Button, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { FancyCard } from "../../shared/components/FancyCard";
import { Scaffold } from "../../shared/components/Scaffold";

const qualityChoices = [
  { id: "again", label: "دوباره", color: "error" as const },
  { id: "hard", label: "سخت", color: "warning" as const },
  { id: "good", label: "خوب", color: "success" as const },
  { id: "easy", label: "ساده", color: "info" as const },
];

export default function BoxLevelReviewPage() {
  const { id } = useParams<{ id: string }>();
  const boxLevelId = Number(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [reviews, setReviews] = useState<Record<number, string>>({});

  const dueCardsQuery = useQuery({
    queryKey: ["leitner-box-level-due-cards", boxLevelId],
    queryFn: () => LeitnerBoxService.getDueWordsByBoxLevelId(boxLevelId),
    enabled: Number.isFinite(boxLevelId) && boxLevelId > 0,
  });

  const boxLevelsQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
  });

  const levelInfo = useMemo(() => {
    return (boxLevelsQuery.data?.levels ?? []).find(
      (item) => item.id === boxLevelId,
    );
  }, [boxLevelId, boxLevelsQuery.data?.levels]);

  const cards = dueCardsQuery.data ?? [];
  const levelNumber = levelInfo ? Number(levelInfo.level) : null;

  const reviewedCount = Object.keys(reviews).length;
  const activeCard = cards[currentIndex] ?? null;
  const isCompleted = cards.length > 0 && currentIndex >= cards.length;

  function handleReveal() {
    if (!activeCard) return;
    setIsAnswerVisible((prev) => !prev);
  }

  function handleQualitySelect(choice: string) {
    if (!activeCard) return;

    setReviews((prev) => ({ ...prev, [activeCard.id]: choice }));
    setCurrentIndex((prev) => prev + 1);
    setIsAnswerVisible(false);
  }

  if (!Number.isFinite(boxLevelId) || boxLevelId <= 0) {
    return (
      <Scaffold header={<DefaultHeader header="Box Level" />} maxWidth="sm">
        <EmptyList message="Invalid box level." />
      </Scaffold>
    );
  }

  if (dueCardsQuery.isLoading || boxLevelsQuery.isLoading) {
    return <AppLoader />;
  }

  if (dueCardsQuery.isError || boxLevelsQuery.isError || !boxLevelsQuery.data) {
    return (
      <ErrorPage
        onAction={() => {
          void dueCardsQuery.refetch();
          void boxLevelsQuery.refetch();
        }}
      />
    );
  }

  return (
    <Scaffold
      maxWidth="sm"
      header={
        <DefaultHeader
          header={`Box Level ${levelNumber ?? boxLevelId}`}
          subtitle={`${levelInfo?.dueItemsCount ?? cards.length} ready cards`}
        />
      }
    >
      {cards.length === 0 ? (
        <EmptyList message="No cards are due for review in this box level right now." />
      ) : isCompleted ? (
        <FancyCard sx={{ borderRadius: 4 }}>
          <Stack spacing={2} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Review completed
            </Typography>
            <Typography color="text.secondary">
              You reviewed {reviewedCount} card{reviewedCount === 1 ? "" : "s"}{" "}
              in this box level.
            </Typography>
          </Stack>
        </FancyCard>
      ) : (
        <Stack
          spacing={3}
          sx={{
            minHeight: "calc(100dvh - 140px)",
            justifyContent: "space-between",
          }}
        >
          <Stack sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={(reviewedCount / cards.length) * 100}
              sx={{ mb: 1.25, borderRadius: 999 }}
            />
            <Typography variant="caption" color="text.secondary">
              Card {currentIndex + 1} of {cards.length}
            </Typography>
            <Card
              onClick={handleReveal}
              sx={{
                minHeight: 320,
                borderRadius: 4,
                cursor: "pointer",
                p: 2,
                mt: 3,
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack
                spacing={3}
                sx={{
                  height: "100%",
                  minHeight: 280,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  {isAnswerVisible ? "Translation" : "Word"}
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {isAnswerVisible
                    ? activeCard.translation || "No translation available"
                    : activeCard.word}
                </Typography>

                <Typography sx={{ direction: "rtl" }} color="text.secondary">
                  {isAnswerVisible
                    ? "Choose how well you remembered it."
                    : "Tap the card to reveal the translation."}
                </Typography>
              </Stack>
            </Card>
          </Stack>

          <Stack spacing={1.5} sx={{ mt: "auto", pb: 2 }}>
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              {qualityChoices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="contained"
                  color={choice.color}
                  disabled={!isAnswerVisible}
                  onClick={() => handleQualitySelect(choice.id)}
                  sx={{ flex: 1, minWidth: 0, borderRadius: 999 }}
                >
                  {choice.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Scaffold>
  );
}
