import { Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GrammarsService } from "../../../api/Learnup";
import GrammarCard from "../components/GrammarCard";

export default function ListGrammarPage() {
  const grammarQuery = useQuery({
    queryKey: ["listGrammar"],
    queryFn: () => GrammarsService.getMobileGrammars1(),
  });

  if (grammarQuery.isLoading || grammarQuery.isFetching) {
    return <>...isloading</>;
  }

  return (
    <>
      <Container>
        {grammarQuery.data?.map((i) => (
          <GrammarCard grammar={i} key={i.id} />
        ))}
      </Container>
    </>
  );
}
