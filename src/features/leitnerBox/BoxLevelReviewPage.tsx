import {
  Box,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AnswerQuality,
  type DueLeitnerBoxItemResponse,
} from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { FilledActionButton } from "../../shared/components/FilledActionButton";
import { Scaffold } from "../../shared/components/Scaffold";
import { closeDrawer, showDrawer } from "../../shared/swipeableDrawer";
import { LessonTimeline } from "../lessons/components/LessonTimeline";
import { ReviewAnswerPanel } from "./components/ReviewAnswerPanel";
import { ReviewCompletedCard } from "./components/ReviewCompletedCard";
import { useBoxLevelReview } from "./hooks/useBoxLevelReview";

export default function BoxLevelReviewPage () {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string; }>();
  const boxLevelId = Number(id);

  const actionPendingRef = useRef(false);
  const [completedCards, setCompletedCards] = useState<
    DueLeitnerBoxItemResponse[]
  >([]);
  const [reviewedCount, setReviewedCount] = useState(0);

  const {
    cards,
    isActionPending,
    isError,
    isLoading,
    levelNumber,
    refetch,
    reviewMutation,
    removeMutation,
  } = useBoxLevelReview(boxLevelId);

  const completedCardIds = new Set(completedCards.map((card) => card.id));
  const pendingCards = cards.filter((card) => !completedCardIds.has(card.id));
  const totalCards = reviewedCount + pendingCards.length;
  const isCompleted = reviewedCount > 0 && pendingCards.length === 0;
  const timelineCards = [...completedCards, ...pendingCards];

  actionPendingRef.current = isActionPending;

  function handleOpenCard (card: DueLeitnerBoxItemResponse) {
    if (actionPendingRef.current) return;

    showDrawer(
      <ReviewAnswerPanel
        card={card}
        disabled={actionPendingRef.current}
        isPending={actionPendingRef.current}
        onHide={closeActiveDrawer}
        onMainAction={() => submitReview(card, AnswerQuality.MILD)}
        onQualitySelect={(quality) => submitReview(card, quality)}
        onRemove={() => handleRemove(card)}
      />,
      {
        anchor: "bottom",
        disableDiscovery: false,
        paperSx: {
          maxHeight: "88vh",
        },
      },
    );
  }

  function submitReview (
    card: DueLeitnerBoxItemResponse,
    quality: AnswerQuality,
  ) {
    if (actionPendingRef.current) return;

    reviewMutation.mutate(
      {
        itemId: card.id,
        answerQuality: quality,
      },
      {
        onSuccess: () => {
          setCompletedCards((prev) => [...prev, card]);
          setReviewedCount((prev) => prev + 1);
          closeActiveDrawer();
        },
      },
    );
  }

  function handleRemove (card: DueLeitnerBoxItemResponse) {
    if (actionPendingRef.current) return;

    removeMutation.mutate(
      {
        itemId: card.id,
        vocabId: card.vocabId,
      },
      {
        onSuccess: () => {
          closeActiveDrawer();
        },
      },
    );
  }

  function closeActiveDrawer () {
    closeDrawer();
  }

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError) {
    return <ErrorPage onAction={refetch} />;
  }

  return (
    <Scaffold
      header={
        <DefaultHeader
          header={`سطح ${levelNumber ?? boxLevelId}`}
        ></DefaultHeader>
      }
    >
      {totalCards === 0 ? (
        <EmptyList message="در حال حاضر واژه‌ای برای مرور در این سطح وجود ندارد." />
      ) : isCompleted ? (
        <ReviewCompletedCard
          reviewedCount={reviewedCount}
          onBackToBox={() => navigate("/leitner-box")}
        />
      ) : (
        <Stack spacing={1}>
          {timelineCards.map((c, index) => {
            const completed = completedCardIds.has(c.id);

            return (
              <Stack
                key={c.id}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "stretch" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Card
                    onClick={() => {
                      if (!completed) {
                        handleOpenCard(c);
                      }
                    }}
                    sx={{
                      cursor: completed ? "default" : "pointer",
                      direction: "rtl",
                      p: 2,
                    }}
                  >
                    <Stack direction="row">
                      <Stack>
                        <Typography
                          variant="body1"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {c.word}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {completed
                            ? "Reviewed"
                            : "Click for show translation"}
                        </Typography>
                      </Stack>
                      <Box sx={{ flex: 1 }} />
                      <FilledActionButton
                        icon={completed ? "check_circle" : "done"}
                        disabled={completed || isActionPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          submitReview(c, AnswerQuality.MILD);
                        }}
                      />
                    </Stack>
                  </Card>
                </Box>
                <LessonTimeline
                  completed={completed}
                  isLast={index === timelineCards.length - 1}
                />
              </Stack>
            );
          })}
        </Stack>
      )}
    </Scaffold>
  );
}
