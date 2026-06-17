import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { VocabTestsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { VocabTestCard } from './components/VocabTestCard';
import VocabTestResult from './components/VocabTestResult';

function TestsHeader ({ results }: { results: (boolean | null)[]; }) {
  const answered = results.filter((r) => r !== null).length;
  const total = results.length;

  return (
    <Box>
      <DefaultHeader header='آزمون لغات'>
        <Typography variant='caption' sx={{ color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
          {answered} / {total}
        </Typography>
      </DefaultHeader>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
          mx: 2,
          my: 1,
          px: 2,
          py: 1,
          borderRadius: 3,
          bgcolor: 'action.hover',
          border: '1px solid',
          borderColor: 'divider',
          minHeight: 36,
        }}
      >
        {results.map((result, i) => (
          <Box
            key={i}
            sx={{
              width: result !== null ? 12 : 8,
              height: result !== null ? 12 : 8,
              borderRadius: '50%',
              bgcolor:
                result === true
                  ? 'success.light'
                  : result === false
                    ? 'error.main'
                    : 'action.disabled',
              boxShadow:
                result === true
                  ? '0 0 8px 2px rgba(52, 211, 153, 0.55)'
                  : result === false
                    ? '0 0 8px 2px rgba(220, 38, 38, 0.5)'
                    : 'none',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

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
      <TestsHeader results={results} />
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Swiper
          style={{ height: '100%' }}
          direction='horizontal'
          modules={[Pagination]}
          pagination={{ clickable: true }}
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
