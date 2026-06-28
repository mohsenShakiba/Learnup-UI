import {
  Button,
  Card,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnswerQuality, LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { FancyCard } from "../../shared/components/FancyCard";
import { Scaffold } from "../../shared/components/Scaffold";

const qualityChoices = [
  {
    id: "again",
    label: "دوباره",
    color: "error" as const,
    answerQuality: AnswerQuality.NO_IDEA,
  },
  {
    id: "hard",
    label: "سخت",
    color: "warning" as const,
    answerQuality: AnswerQuality.HARD,
  },
  {
    id: "good",
    label: "خوب",
    color: "success" as const,
    answerQuality: AnswerQuality.MILD,
  },
  {
    id: "easy",
    label: "ساده",
    color: "info" as const,
    answerQuality: AnswerQuality.PEACE_OF_CAKE,
  },
];

export default function BoxLevelReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const boxLevelId = Number(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [reviews, setReviews] = useState<Record<number, string>>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const dueCardsQuery = useQuery({
    queryKey: ["leitner-box-level-due-cards", boxLevelId],
    queryFn: () => LeitnerBoxService.getDueWordsByBoxLevelId(boxLevelId),
    enabled: Number.isFinite(boxLevelId) && boxLevelId > 0,
  });

  const boxLevelsQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      itemId,
      answerQuality,
    }: {
      itemId: number;
      answerQuality: AnswerQuality;
    }) =>
      LeitnerBoxService.reviewLeitnerBoxItem(itemId, {
        answerQuality,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["leitner-box-levels"] }),
        queryClient.invalidateQueries({
          queryKey: ["leitner-box-level-due-cards", boxLevelId],
        }),
      ]);
    },
    onError: () => {
      setShowErrorMessage(true);
    },
  });

  const levelInfo = useMemo(() => {
    return (boxLevelsQuery.data?.levels ?? []).find(
      (item) => item.id === boxLevelId,
    );
  }, [boxLevelId, boxLevelsQuery.data?.levels]);

  const cards = dueCardsQuery.data ?? [];
  const pendingCards = useMemo(
    () => cards.filter((card) => !(card.id in reviews)),
    [cards, reviews],
  );
  const levelNumber = levelInfo ? Number(levelInfo.level) : null;

  const reviewedCount = Object.keys(reviews).length;
  const totalCards = reviewedCount + pendingCards.length;
  const activeCard = pendingCards[0] ?? null;
  const isCompleted = totalCards > 0 && pendingCards.length === 0;

  function handleReveal() {
    if (!activeCard || reviewMutation.isPending) return;
    setIsAnswerVisible((prev) => !prev);
  }

  function handleQualitySelect(choice: (typeof qualityChoices)[number]) {
    if (!activeCard) return;

    reviewMutation.mutate(
      {
        itemId: activeCard.id,
        answerQuality: choice.answerQuality,
      },
      {
        onSuccess: () => {
          setReviews((prev) => ({ ...prev, [activeCard.id]: choice.id }));
          setCurrentIndex((prev) => prev + 1);
          setIsAnswerVisible(false);
        },
      },
    );
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
          subtitle={`${levelInfo?.dueItemsCount ?? pendingCards.length} ready cards`}
        />
      }
    >
      {totalCards === 0 ? (
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
            <Button
              variant="contained"
              onClick={() => navigate("/leitner-box")}
              sx={{ alignSelf: "center", borderRadius: 999 }}
            >
              Back to Leitner Box
            </Button>
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
              value={totalCards === 0 ? 0 : (reviewedCount / totalCards) * 100}
              sx={{ mb: 1.25, borderRadius: 999 }}
            />
            <Typography variant="caption" color="text.secondary">
              Card {reviewedCount + 1} of {totalCards}
            </Typography>
            <Card
              onClick={handleReveal}
              sx={{
                minHeight: 320,
                borderRadius: 4,
                cursor: reviewMutation.isPending ? "progress" : "pointer",
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
                  disabled={!isAnswerVisible || reviewMutation.isPending}
                  onClick={() => handleQualitySelect(choice)}
                  sx={{ flex: 1, minWidth: 0, borderRadius: 999 }}
                >
                  {choice.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}

      <Snackbar
        open={showErrorMessage}
        autoHideDuration={4000}
        onClose={() => setShowErrorMessage(false)}
        message="Failed to submit review."
      />
    </Scaffold>
  );
}
