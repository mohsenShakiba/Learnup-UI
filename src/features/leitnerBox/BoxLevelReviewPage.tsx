import {
  Box,
  Button,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { AnswerQuality, LeitnerBoxService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { FancyCard } from "../../shared/components/FancyCard";
import { Scaffold } from "../../shared/components/Scaffold";
import { ReviewAnswerCard } from "./components/ReviewAnswerCard";
import { ReviewQuestionCard } from "./components/ReviewQuestionCard";

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

  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [reviews, setReviews] = useState<Record<number, string>>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

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
  const safeActiveCardIndex =
    pendingCards.length > 0
      ? Math.min(activeCardIndex, pendingCards.length - 1)
      : 0;
  const activeCard = pendingCards[safeActiveCardIndex] ?? null;
  const isCompleted = totalCards > 0 && pendingCards.length === 0;

  useEffect(() => {
    if (pendingCards.length === 0) {
      if (activeCardIndex !== 0) {
        setActiveCardIndex(0);
      }
      return;
    }

    if (activeCardIndex > pendingCards.length - 1) {
      const nextIndex = pendingCards.length - 1;
      setActiveCardIndex(nextIndex);
      swiperRef.current?.slideTo(nextIndex, 0);
    }
  }, [activeCardIndex, pendingCards.length]);

  function handleReveal() {
    if (!activeCard || reviewMutation.isPending) return;
    setIsAnswerVisible(true);
  }

  function handleHideAnswer() {
    if (reviewMutation.isPending) return;
    setIsAnswerVisible(false);
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
          const nextPendingLength = pendingCards.length - 1;
          const nextIndex =
            nextPendingLength <= 0
              ? 0
              : Math.min(safeActiveCardIndex, nextPendingLength - 1);

          setReviews((prev) => ({ ...prev, [activeCard.id]: choice.id }));
          setActiveCardIndex(nextIndex);
          window.requestAnimationFrame(() => {
            swiperRef.current?.slideTo(nextIndex, 0);
          });
          setIsAnswerVisible(false);
        },
      },
    );
  }

  function handleSlideChange(swiper: SwiperType) {
    setActiveCardIndex(swiper.activeIndex);
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
      disablePadding
      header={
        <DefaultHeader header={`Box Level ${levelNumber ?? boxLevelId}`} />
      }
    >
      {totalCards === 0 ? (
        <EmptyList message="No cards are due for review in this box level right now." />
      ) : isCompleted ? (
        <FancyCard sx={{ borderRadius: 4, p: 2 }}>
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
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Stack sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={
                totalCards === 0
                  ? 0
                  : ((activeCardIndex + 1) / totalCards) * 100
              }
              sx={{ mb: 1.25, borderRadius: 999 }}
            />
            <Box sx={{ px: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Card {safeActiveCardIndex + 1} of {pendingCards.length}
                {reviewedCount > 0 ? ` - ${reviewedCount} reviewed` : ""}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Swiper
                direction="horizontal"
                slidesPerView={1}
                allowTouchMove={!reviewMutation.isPending}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setActiveCardIndex(swiper.activeIndex);
                }}
                onSlideChange={handleSlideChange}
              >
                {pendingCards.map((card, index) => {
                  const isActiveCard = index === safeActiveCardIndex;

                  return (
                    <SwiperSlide key={card.id}>
                      <Box
                        sx={{
                          height: "100%",
                          overflow: "hidden",
                          p: 2,
                          pt: 1,
                          boxSizing: "border-box",
                        }}
                        id={"test"}
                      >
                        {isActiveCard && isAnswerVisible ? (
                          <Stack
                            sx={{
                              flexDirection: "column",
                              height: "100%",
                              gap: 2,
                            }}
                          >
                            <ReviewAnswerCard
                              card={card}
                              isPending={reviewMutation.isPending}
                              onHide={handleHideAnswer}
                            />

                            <Stack spacing={1.5} sx={{ mt: "auto" }}>
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ width: "100%" }}
                              >
                                {qualityChoices.map((choice) => (
                                  <Button
                                    key={choice.id}
                                    variant="contained"
                                    color={choice.color}
                                    disabled={reviewMutation.isPending}
                                    onClick={() => handleQualitySelect(choice)}
                                    sx={{
                                      flex: 1,
                                      minWidth: 0,
                                      borderRadius: 999,
                                    }}
                                  >
                                    {choice.label}
                                  </Button>
                                ))}
                              </Stack>
                            </Stack>
                          </Stack>
                        ) : (
                          <ReviewQuestionCard
                            card={card}
                            isPending={reviewMutation.isPending}
                            onReveal={handleReveal}
                          />
                        )}
                      </Box>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Box>
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
