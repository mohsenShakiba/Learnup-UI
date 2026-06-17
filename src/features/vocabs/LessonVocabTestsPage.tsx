import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { VocabTestsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { VocabTestCard } from './components/VocabTestCard';
import VocabTestResult from './components/VocabTestResult';

export default function LessonVocabTestsPage () {
  const { id: lessonId } = useParams<{ id: string; }>();
  const lessonIdNumber = Number(lessonId);
  const navigate = useNavigate();

  const testsQuery = useQuery({
    queryKey: ['vocabTests', lessonIdNumber],
    queryFn: () => VocabTestsService.getVocabTests(lessonIdNumber),
    enabled: Number.isFinite(lessonIdNumber),
  });

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const swiperRef = useRef<SwiperType | null>(null);

  const handleAnswer = useCallback((testId: number, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [testId]: isCorrect }));
    if (isCorrect) {
      setTimeout(() => {
        swiperRef.current?.slideNext();
      }, 1000);
    }
  }, []);

  const results = useMemo<(boolean | null)[]>(() => {
    return (testsQuery.data ?? []).map((test) =>
      answers[test.id] !== undefined ? answers[test.id] : test.isCorrect ?? null
    );
  }, [testsQuery.data, answers]);

  const isAlreadyPassed = useMemo(
    () => (testsQuery.data ?? []).length > 0 && (testsQuery.data ?? []).every((t) => t.isCorrect != null),
    [testsQuery.data],
  );

  const allAnsweredInSession = useMemo(
    () => (testsQuery.data ?? []).length > 0 && (testsQuery.data ?? []).every((t) => answers[t.id] !== undefined),
    [testsQuery.data, answers],
  );

  const score = results.length > 0
    ? Math.round((results.filter((r) => r === true).length / results.length) * 100)
    : 0;

  useEffect(() => {
    if (allAnsweredInSession && swiperRef.current) {
      setTimeout(() => {
        swiperRef.current?.slideTo(results.length);
      }, 600);
    }
  }, [allAnsweredInSession, results.length]);

  if (testsQuery.isLoading) {
    return <AppLoader />;
  }

  if (testsQuery.isError || !testsQuery.data) {
    return <ErrorPage onAction={() => void testsQuery.refetch()} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <DefaultHeader header='آزمون لغات'>
      </DefaultHeader>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Swiper
          style={{ height: '100%' }}
          direction='horizontal'
          allowTouchMove={false}
          slidesPerView={1}
          initialSlide={isAlreadyPassed ? testsQuery.data.length : 0}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
        >
          {testsQuery.data.map((test) => (
            <SwiperSlide key={test.id} style={{ height: '100%' }}>
              <VocabTestCard test={test} onAnswer={handleAnswer} />
            </SwiperSlide>
          ))}
          <SwiperSlide style={{ height: '100%' }}>
            <VocabTestResult score={score} onBack={() => navigate(-1)} onRestart={() => { setAnswers({}); swiperRef.current?.slideTo(0); }} />
          </SwiperSlide>
        </Swiper>
      </Box>
    </Box>
  );
}
