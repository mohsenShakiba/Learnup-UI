import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PlacementService } from '../../api/Learnup';
import type { SubmitPlacementRequest } from '../../api/Learnup/models/SubmitPlacementRequest';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { FancyButton } from '../../shared/components/FancyButton';
import { toast } from '../../shared/toast';
import { PlacementQuestionCard } from './components/PlacementQuestionCard';
import PlacementResult from './components/PlacementResult';
import { usePlacementResult, usePlacementTest } from './hooks/usePlacement';

type Phase = 'intro' | 'in-progress' | 'result';

export default function PlacementPage () {
  const testQuery = usePlacementTest();
  const resultQuery = usePlacementResult();

  const questions = useMemo(
    () => [...(testQuery.data?.questions ?? [])].sort((a, b) => a.number - b.number),
    [testQuery.data],
  );

  const [phase, setPhase] = useState<Phase | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasExistingResult = !!resultQuery.data?.placedLevel;

  // Decide the initial screen once both queries settle: a learner with a prior
  // result lands on it directly, everyone else sees the intro.
  useEffect(() => {
    if (phase !== null) return;
    if (testQuery.isLoading || resultQuery.isLoading) return;
    setPhase(hasExistingResult ? 'result' : 'intro');
  }, [phase, testQuery.isLoading, resultQuery.isLoading, hasExistingResult]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, []);

  const submitMutation = useMutation({
    mutationFn: (body: SubmitPlacementRequest) => PlacementService.submitPlacementTest(body),
    onSuccess: async () => {
      await resultQuery.refetch();
      setPhase('result');
    },
    onError: () => {
      // Keep answers so the learner can retry without re-answering.
      toast.error('ثبت آزمون با خطا مواجه شد. لطفا دوباره تلاش کنید.');
    },
  });

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentSlide];
  const isCurrentAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined : false;
  const isLastSlide = currentSlide === totalQuestions - 1;
  const allAnswered =
    totalQuestions > 0 && questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    // Auto-advance after a short delay, except on the last item.
    if (!isLastSlide) {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      slideTimerRef.current = setTimeout(() => {
        swiperRef.current?.slideNext();
      }, 500);
    }
  };

  const handleNext = () => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
    swiperRef.current?.slideNext();
  };

  const handleSubmit = () => {
    if (!allAnswered || submitMutation.isPending) return;
    const body: SubmitPlacementRequest = {
      answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: Number(questionId),
        selectedOptionId,
      })),
    };
    submitMutation.mutate(body);
  };

  const handleStart = () => {
    setCurrentSlide(0);
    setPhase('in-progress');
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentSlide(0);
    swiperRef.current?.slideTo(0);
    setPhase('intro');
  };

  if (phase === null || testQuery.isLoading || resultQuery.isLoading) {
    return <AppLoader />;
  }

  // The test is required for the intro and in-progress phases; a failed result
  // query just means "not taken yet" and is handled by falling back to the intro.
  if (phase !== 'result' && (testQuery.isError || !testQuery.data)) {
    return <ErrorPage onAction={() => void testQuery.refetch()} />;
  }

  return (
    <Stack>
      <DefaultHeader header="آزمون تعیین سطح" />

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

        {phase === 'intro' && testQuery.data && (
          <Stack spacing={1} sx={{ p: 3, overflow: 'auto', flex: 1 }}>

            <Typography variant="h6">{testQuery.data.title}</Typography>

            {testQuery.data.description && (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {testQuery.data.description}
              </Typography>
            )}

            <Box sx={{ flex: 1 }} />
            <FancyButton
              onClick={handleStart}
              sx={{ borderRadius: 999 }}>
              شروع آزمون
            </FancyButton>
          </Stack>
        )}

        {phase === 'in-progress' && (
          totalQuestions === 0 ? (
            <ErrorPage message="سوالی برای این آزمون یافت نشد." />
          ) : (
            <>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Swiper
                  style={{ height: '100%' }}
                  direction="horizontal"
                  allowTouchMove={false}
                  slidesPerView={1}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setCurrentSlide(swiper.activeIndex);
                  }}
                  onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
                >
                  {questions.map((question) => (
                    <SwiperSlide key={question.id} style={{ height: '100%' }}>
                      <PlacementQuestionCard
                        question={question}
                        selectedOptionId={answers[question.id] ?? null}
                        onSelect={(optionId) => handleSelect(question.id, optionId)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>

              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <LinearProgress
                  variant="determinate"
                  value={totalQuestions > 0 ? ((currentSlide + 1) / totalQuestions) * 100 : 0}
                  sx={{ mb: 1.5, borderRadius: 1 }}
                />
                <Stack direction="row" sx={{ direction: 'rtl', alignItems: 'center' }}>
                  {isLastSlide ? (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!allAnswered || submitMutation.isPending}
                      onClick={handleSubmit}
                    >
                      پایان / ثبت
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!isCurrentAnswered}
                      onClick={handleNext}
                    >
                      بعدی
                    </Button>
                  )}
                  <Box sx={{ flex: 1 }} />
                  <Typography sx={{ direction: 'ltr', color: 'text.secondary' }} variant="caption">
                    سوال {currentSlide + 1} از {totalQuestions}
                  </Typography>
                </Stack>
              </Box>
            </>
          )
        )}

        {phase === 'result' && resultQuery.data?.placedLevel && (
          <PlacementResult result={resultQuery.data} onRetake={handleRetake} />
        )}

        {phase === 'result' && !resultQuery.data?.placedLevel && (
          <ErrorPage onAction={() => void resultQuery.refetch()} />
        )}

      </Box>
    </Stack>
  );
}
