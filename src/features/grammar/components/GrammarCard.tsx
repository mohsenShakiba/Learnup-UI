import {
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { GrammarResponse } from "../../../api/Learnup";
import { ActionCard } from "../../../shared/components/ActionCard";
import { DurationBadge } from "../../../shared/components/DurationBadge";

type TGrammarCardProps = {
  grammar: GrammarResponse;
};

export default function GrammarCard (props: TGrammarCardProps) {
  const grammar = props.grammar;
  const navigate = useNavigate();

  return (
    <ActionCard sx={{ p: 2 }} onClick={() => navigate(`/grammars/${grammar.id}`)}>

      <Stack spacing={1}>

        <Typography sx={{ direction: 'rtl' }}>{grammar.name}</Typography>

        <Typography sx={{ color: 'text.secondary' }}>{grammar.description}</Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: 'space-between' }}>

          <Chip
            size="small"
            label={`Level ${grammar.level}`}
            color="primary"
          />

          <DurationBadge minutes={grammar.estimatedTime} />
        </Stack>
      </Stack>

    </ActionCard>
  );
}
