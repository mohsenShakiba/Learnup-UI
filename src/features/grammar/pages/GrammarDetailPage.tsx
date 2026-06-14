import { Chip, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GrammarsService } from '../../../api/Learnup';
import { AppLoader } from '../../../shared/components/AppLoader';
import { DefaultHeader } from '../../../shared/components/DefaultHeader';
import { ErrorPage } from '../../../shared/components/ErrorPage';
import { Scaffold } from '../../../shared/components/Scaffold';
import { GrammarContentRenderer } from '../components/GrammarContentRenderer';

export default function GrammarDetailPage() {
  const { id: grammarId } = useParams<{ id: string }>();
  const grammarIdNumber = Number(grammarId);

  const grammarQuery = useQuery({
    queryKey: ['grammar', grammarIdNumber],
    queryFn: () => GrammarsService.getMobileGrammars(grammarIdNumber),
    enabled: Number.isFinite(grammarIdNumber),
  });

  if (grammarQuery.isLoading) {
    return <AppLoader />;
  }

  if (grammarQuery.isError || !grammarQuery.data) {
    return <ErrorPage onAction={() => void grammarQuery.refetch()} />;
  }

  const grammar = grammarQuery.data;

  return (
    <Scaffold
      maxWidth="sm"
      header={(
        <DefaultHeader
          header={grammar.name}
          subtitle={`${grammar.lessons.length} lessons`}
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
