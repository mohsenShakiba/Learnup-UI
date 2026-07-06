import { Chip, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { GrammarsService, UserLessonStatus } from '../../../api/Learnup';
import { AppLoader } from '../../../shared/components/AppLoader';
import { DefaultHeader } from '../../../shared/components/DefaultHeader';
import { ErrorPage } from '../../../shared/components/ErrorPage';
import { Scaffold } from '../../../shared/components/Scaffold';
import { useSectionCompleted } from '../../lessons/hooks/useSectionCompleted';
import { GrammarContentRenderer } from '../components/GrammarContentRenderer';

export default function GrammarDetailPage () {
  const { id: grammarId } = useParams<{ id: string; }>();
  const grammarIdNumber = Number(grammarId);
  const { state } = useLocation();
  const lessonId = (state as { lessonId?: number; } | null)?.lessonId ?? null;

  const grammarQuery = useQuery({
    queryKey: ['grammar', grammarIdNumber],
    queryFn: () => GrammarsService.getMobileGrammars(grammarIdNumber),
    enabled: Number.isFinite(grammarIdNumber),
  });

  useSectionCompleted(lessonId, UserLessonStatus.GRAMMAR_COMPLETED, grammarQuery.data != null);

  if (grammarQuery.isLoading) {
    return <AppLoader />;
  }

  if (grammarQuery.isError || !grammarQuery.data) {
    return <ErrorPage onAction={() => void grammarQuery.refetch()} />;
  }

  const grammar = grammarQuery.data;

  return (
    <Scaffold
      header={(
        <DefaultHeader
          header={grammar.name}
        >
          <Chip
            size="small"
            color="primary"
            label={`Level ${grammar.level}`}
          />
        </DefaultHeader>
      )}
    >
      <Stack spacing={2}>
        <GrammarContentRenderer lessons={grammar.lessons} />
      </Stack>
    </Scaffold>
  );
}
