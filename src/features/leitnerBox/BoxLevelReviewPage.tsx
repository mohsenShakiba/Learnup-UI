import {
  Box,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import { AppIcon } from "../../shared/components/AppIcon";
import { Scaffold } from "../../shared/components/Scaffold";
import { ReviewAnswerCard } from "./components/ReviewAnswerCard";
import { ReviewQuestionCard } from "./components/ReviewQuestionCard";

type QualityChoice = {
  id: string;
  answerQuality: AnswerQuality;
};

// دکمه‌ی اصلی: پاسخ درست، واژه را به سطح بعد منتقل می‌کند.
const advanceChoice: QualityChoice = {
  id: "good",
  answerQuality: AnswerQuality.MILD,
};

// گزینه‌های منو برای درجه‌بندی‌های دیگر.
const menuQualityChoices: (QualityChoice & {
  label: string;
  icon: string;
  color: string;
})[] = [
    {
      id: "again",
      label: "دوباره",
      icon: "replay",
      color: "error.main",
      answerQuality: AnswerQuality.NO_IDEA,
    },
    {
      id: "hard",
      label: "سخت",
      icon: "trending_down",
      color: "warning.main",
      answerQuality: AnswerQuality.HARD,
    },
    {
      id: "easy",
      label: "ساده",
      icon: "bolt",
      color: "info.main",
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
  const [removedCardIds, setRemovedCardIds] = useState<Set<number>>(new Set());
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
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

  const removeMutation = useMutation({
    mutationFn: (vocabId: number) =>
      LeitnerBoxService.removeVocabFromLeitnerBox(vocabId),
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
    () =>
      cards.filter(
        (card) => !(card.id in reviews) && !removedCardIds.has(card.id),
      ),
    [cards, reviews, removedCardIds],
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

  function handleQualitySelect(choice: QualityChoice) {
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

  function handleRemove() {
    if (!activeCard || removeMutation.isPending || reviewMutation.isPending)
      return;

    const cardId = activeCard.id;
    removeMutation.mutate(activeCard.vocabId, {
      onSuccess: () => {
        const nextPendingLength = pendingCards.length - 1;
        const nextIndex =
          nextPendingLength <= 0
            ? 0
            : Math.min(safeActiveCardIndex, nextPendingLength - 1);

        setRemovedCardIds((prev) => {
          const next = new Set(prev);
          next.add(cardId);
          return next;
        });
        setActiveCardIndex(nextIndex);
        window.requestAnimationFrame(() => {
          swiperRef.current?.slideTo(nextIndex, 0);
        });
        setIsAnswerVisible(false);
      },
    });
  }

  function handleSlideChange(swiper: SwiperType) {
    setActiveCardIndex(swiper.activeIndex);
    setIsAnswerVisible(false);
  }

  // دکمه‌ی اصلی: ابتدا ترجمه را نشان می‌دهد، سپس واژه را به سطح بعد می‌برد.
  function handleMainAction() {
    if (!activeCard || reviewMutation.isPending || removeMutation.isPending)
      return;

    if (isAnswerVisible) {
      handleQualitySelect(advanceChoice);
    } else {
      setIsAnswerVisible(true);
    }
  }

  function handleMenuSelect(action: () => void) {
    setMenuAnchor(null);
    action();
  }

  if (!Number.isFinite(boxLevelId) || boxLevelId <= 0) {
    return (
      <Scaffold header={<DefaultHeader header="جعبه‌ی لایتنر" />} maxWidth="sm">
        <EmptyList message="سطح انتخاب‌شده نامعتبر است." />
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
      header={
        <DefaultHeader header={`سطح ${levelNumber ?? boxLevelId}`} />
      }
    >
      {totalCards === 0 ? (
        <EmptyList message="در حال حاضر واژه‌ای برای مرور در این سطح وجود ندارد." />
      ) : isCompleted ? (
        <FancyCard sx={{ borderRadius: 2, p: 2 }}>
          <Stack spacing={2} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              مرور این سطح کامل شد
            </Typography>
            <Typography color="text.secondary">
              شما {reviewedCount} واژه را در این سطح مرور کردید.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/leitner-box")}
              sx={{ alignSelf: "center", borderRadius: 999 }}
            >
              بازگشت به جعبه‌ی لایتنر
            </Button>
          </Stack>
        </FancyCard>
      ) : (
        <Stack
          spacing={1}
          sx={{
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Swiper
            direction="horizontal"
            slidesPerView={1}
            style={{ flex: 1, width: "100%" }}
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
                      width: '100%',
                      height: "100%",
                      overflow: "hidden",
                      boxSizing: "border-box",
                    }}
                    id={"test"}
                  >
                    {isActiveCard && isAnswerVisible ? (
                      <ReviewAnswerCard
                        card={card}
                        isPending={reviewMutation.isPending}
                        onHide={handleHideAnswer}
                      />
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

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          >
            <Button
              variant="contained"
              disabled={
                !activeCard ||
                reviewMutation.isPending ||
                removeMutation.isPending
              }
              onClick={handleMainAction}
              sx={{
                flex: 1,
                borderRadius: 1,
              }}
            >
              {isAnswerVisible ? "انتقال به سطح بعد" : "نمایش ترجمه"}
            </Button>

            <IconButton
              aria-label="گزینه‌های بیشتر"
              disabled={
                !activeCard ||
                reviewMutation.isPending ||
                removeMutation.isPending
              }
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <AppIcon>more_vert</AppIcon>
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
              slotProps={{
                list: { dense: true },
                paper: { sx: { minWidth: 180, borderRadius: 2 } },
              }}
            >
              {menuQualityChoices.map((choice) => (
                <MenuItem
                  key={choice.id}
                  onClick={() =>
                    handleMenuSelect(() => handleQualitySelect(choice))
                  }
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AppIcon sx={{ color: choice.color, fontSize: 20 }}>
                      {choice.icon}
                    </AppIcon>
                  </ListItemIcon>
                  <ListItemText>{choice.label}</ListItemText>
                </MenuItem>
              ))}

              <Divider />

              <MenuItem onClick={() => handleMenuSelect(handleRemove)}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <AppIcon sx={{ color: "error.main", fontSize: 20 }}>
                    delete
                  </AppIcon>
                </ListItemIcon>
                <ListItemText sx={{ color: "error.main" }}>
                  حذف از جعبه
                </ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
      )}

      <Snackbar
        open={showErrorMessage}
        autoHideDuration={4000}
        onClose={() => setShowErrorMessage(false)}
        message="ثبت مرور با خطا مواجه شد."
      />
    </Scaffold>
  );
}
