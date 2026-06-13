import { Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GrammarsService } from "../../../api/Learnup";
import { Scaffold } from "../../../shared/components/Scaffold";
import GrammarCard from "../components/GrammarCard";

export default function ListGrammarPage() {
  const grammarQuery = useQuery({
    queryKey: ["listGrammar"],
    queryFn: () => GrammarsService.getMobileGrammars1(),
  });

  const orderedGrammars = useMemo(
    () => grammarQuery.data ?? [],
    [grammarQuery.data],
  );

  if (grammarQuery.isLoading || grammarQuery.isFetching) {
    return <>...isloading</>;
  }

  return (
    <Scaffold
      header={
        <Stack>
          <Typography color="primary">گرامرها</Typography>
        </Stack>
      }
      maxWidth="sm"
    >
      <Stack spacing={2}>
        {orderedGrammars.map((i) => (
          <GrammarCard grammar={i} key={i.id} />
        ))}
      </Stack>
    </Scaffold>
  );
}
