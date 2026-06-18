import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GrammarTestsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { GrammarTestCard } from './components/GrammarTestCard';
import GrammarTestResult from './components/GrammarTestResult';

export default function LessonGrammarTestsPage () {
  const { id: lessonId } = useParams<{ id: string; }>();
  const lessonIdNumber = Number(lessonId);
  const navigate = useNavigate();

  const testsQuery = useQuery({
    queryKey: ['grammarTests', lessonIdNumber],
    queryFn: () => GrammarTestsService.getGrammarTests(lessonIdNumber),
    enabled: Number.isFinite(lessonIdNumber),
  });

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialSlide = useMemo(() => {
    if (!testsQuery.data) return 0;
    const firstUnanswered = testsQuery.data.findIndex((t) => t.isCorrect === null);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  }, [testsQuery.data]);

  const handleAnswer = useCallback((testId: number, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [testId]: isCorrect }));
    slideTimerRef.current = setTimeout(() => {
      swiperRef.current?.slideNext();
    }, 500);
  }, []);

  const resetMutation = useMutation({
    mutationFn: (lessonId: number) => GrammarTestsService.resetGrammarTestResult(lessonId),
    onSuccess: () => {
      void testsQuery.refetch();
      setAnswers({});
      setCurrentSlide(0);
      swiperRef.current?.slideTo(0);
    },
  });

  const results = useMemo<(boolean | null)[]>(() => {
    return (testsQuery.data ?? []).map((test) =>
      answers[test.id] !== undefined ? answers[test.id] : test.isCorrect ?? null
    );
  }, [testsQuery.data, answers]);

  const isAlreadyPassed = useMemo(
    () => (testsQuery.data ?? []).length > 0 && (testsQuery.data ?? []).every((t) => t.isCorrect != null),
    [testsQuery.data],
  );

  useEffect(() => {
    if (!testsQuery.data || testsQuery.data.length === 0 || isAlreadyPassed) return;
    const allAnswered = testsQuery.data.every(
      (t) => answers[t.id] !== undefined || t.isCorrect !== null
    );
    if (allAnswered) {
      void testsQuery.refetch();
    }
  }, [answers, testsQuery, isAlreadyPassed]);

  const score = results.length > 0
    ? Math.round((results.filter((r) => r === true).length / results.length) * 100)
    : 0;

  const totalTests = testsQuery.data?.length ?? 0;
  const currentTest = testsQuery.data?.[currentSlide];
  const isCurrentAnswered = currentTest
    ? answers[currentTest.id] !== undefined || currentTest.isCorrect !== null
    : false;
  const isLastSlide = currentSlide === totalTests - 1;

  const handleBack = () => {
    navigate(-1);
  };

  const handleRestart = () => {
    resetMutation.mutate(lessonIdNumber);
  };

  const handleNext = () => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
    swiperRef.current?.slideNext();
  };

  if (testsQuery.isLoading) {
    return <AppLoader />;
  }

  if (testsQuery.isError || !testsQuery.data) {
    return <ErrorPage onAction={() => void testsQuery.refetch()} />;
  }

  return (
    <Stack sx={{ height: '100%' }}>

      <DefaultHeader header='آزمون گرامر' />

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

        {!isAlreadyPassed && (
          <>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Swiper
                style={{ height: '100%' }}
                direction='horizontal'
                allowTouchMove={false}
                slidesPerView={1}
                initialSlide={initialSlide}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setCurrentSlide(swiper.activeIndex);
                }}
                onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
              >
                {testsQuery.data.map((test) => (
                  <SwiperSlide key={test.id} style={{ height: '100%' }}>
                    <GrammarTestCard test={test} onAnswer={handleAnswer} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <LinearProgress
                variant="determinate"
                value={totalTests > 0 ? ((currentSlide + 1) / totalTests) * 100 : 0}
                sx={{ mb: 1.5, borderRadius: 1 }}
              />
              <Stack direction="row" sx={{ direction: 'rtl' }}>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!isCurrentAnswered || isLastSlide}
                  onClick={handleNext}
                >
                  بعدی
                </Button>
                <Box sx={{ flex: 1 }} />
                <Typography sx={{ direction: 'ltr', color: 'text.secondary' }} variant="caption">
                  سوال {currentSlide + 1} از {totalTests}
                </Typography>
              </Stack>
            </Box>
          </>
        )}

        {isAlreadyPassed && (
          <GrammarTestResult
            isLoading={resetMutation.isPending}
            score={score}
            onBack={handleBack}
            onRestart={handleRestart}
          />
        )}

      </Box>
    </Stack>
  );
}
