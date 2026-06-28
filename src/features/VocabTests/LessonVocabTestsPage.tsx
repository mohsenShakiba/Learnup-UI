import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { StorySection, TestsService, TestType } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { useLesson } from '../lessons/hooks/useLesson';
import { useSectionCompleted } from '../lessons/hooks/useSectionCompleted';
import { VocabTestCard } from './components/VocabTestCard';
import VocabTestResult from './components/VocabTestResult';

export default function LessonVocabTestsPage () {
  const { id: lessonId } = useParams<{ id: string; }>();
  const lessonIdNumber = Number(lessonId);
  const navigate = useNavigate();

  const lessonQuery = useLesson(lessonIdNumber);
  const tests = useMemo(
    () => (lessonQuery.data?.tests ?? []).filter((test) => test.type === TestType.VOCAB),
    [lessonQuery.data],
  );

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialSlide = useMemo(() => {
    const firstUnanswered = tests.findIndex((t) => t.isCorrect === null);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  }, [tests]);

  const handleAnswer = useCallback((testId: number, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [testId]: isCorrect }));
    slideTimerRef.current = setTimeout(() => {
      swiperRef.current?.slideNext();
    }, 500);
  }, []);

  const resetMutation = useMutation({
    mutationFn: (lessonId: number) => TestsService.resetTestResult(lessonId, TestType.VOCAB),
    onSuccess: () => {
      void lessonQuery.refetch();
      setAnswers({});
      setCurrentSlide(0);
      swiperRef.current?.slideTo(0);
    },
  });

  const results = useMemo<(boolean | null)[]>(() => {
    return tests.map((test) =>
      answers[test.id] !== undefined ? answers[test.id] : test.isCorrect ?? null
    );
  }, [tests, answers]);

  const isAlreadyPassed = useMemo(
    () => tests.length > 0 && tests.every((t) => t.isCorrect != null),
    [tests],
  );

  const isCompleted = useMemo(
    () => tests.length > 0 && tests.every((t) => answers[t.id] !== undefined || t.isCorrect !== null),
    [tests, answers],
  );

  useSectionCompleted(lessonIdNumber, StorySection.VOCAB_TEST, isCompleted);

  // Refetch when all tests answered in this session to transition to results screen
  useEffect(() => {
    if (tests.length === 0 || isAlreadyPassed) return;
    if (isCompleted) {
      void lessonQuery.refetch();
    }
  }, [isCompleted, isAlreadyPassed, tests, lessonQuery]);

  const score = results.length > 0
    ? Math.round((results.filter((r) => r === true).length / results.length) * 100)
    : 0;

  const totalTests = tests.length;
  const currentTest = tests[currentSlide];
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

  if (lessonQuery.isLoading) {
    return <AppLoader />;
  }

  if (lessonQuery.isError || !lessonQuery.data) {
    return <ErrorPage onAction={() => void lessonQuery.refetch()} />;
  }

  return (
    <Stack sx={{ height: '100%' }}>

      <DefaultHeader header='آزمون لغات' />

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
                {tests.map((test) => (
                  <SwiperSlide key={test.id} style={{ height: '100%' }}>
                    <VocabTestCard test={test} onAnswer={handleAnswer} />
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
          <VocabTestResult
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
