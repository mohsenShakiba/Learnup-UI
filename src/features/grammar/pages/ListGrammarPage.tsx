import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GrammarsService } from "../../../api/Learnup";
import { AppLoader } from "../../../shared/components/AppLoader";
import { Scaffold } from "../../../shared/components/Scaffold";
import GrammarCard from "../components/GrammarCard";

export default function ListGrammarPage () {
  const grammarQuery = useQuery({
    queryKey: ["listGrammar"],
    queryFn: () => GrammarsService.getMobileGrammars1(),
  });

  const orderedGrammars = useMemo(
    () => grammarQuery.data ?? [],
    [grammarQuery.data],
  );

  if (grammarQuery.isLoading || grammarQuery.isFetching) {
    return <AppLoader />;
  }

  return (
    <Stack sx={{ height: "100%", padding: 2 }} spacing={2}>
      {orderedGrammars.map((i) => (
        <GrammarCard grammar={i} key={i.id} />
      ))}
    </Stack>
  );
}
