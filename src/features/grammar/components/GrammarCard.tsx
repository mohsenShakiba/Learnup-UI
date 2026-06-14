import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { GrammarResponse } from "../../../api/Learnup";

type TGrammarCardProps = {
  grammar: GrammarResponse;
};

export default function GrammarCard(props: TGrammarCardProps) {
  const grammar = props.grammar;
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 4,
        cursor: "pointer",
        transition: "0.2s",
        height: "100%",
        padding: 0,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/grammars/${grammar.id}`)}>
        <CardMedia
          component="img"
          image="/images/grammar/articles.png"
          title="green iguana"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        <CardHeader title={grammar.name} />
        <CardContent>
          <Stack spacing={2}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                direction: "rtl",
                paddingBottom: 4,
              }}
            >
              {grammar.description}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip
                size="small"
                label={`Level ${grammar.level}`}
                color="primary"
              />

              <Chip
                size="small"
                icon={<Icon>access_time_rounded</Icon>}
                label={`${grammar.estimatedTime} min`}
                variant="outlined"
              />
            </Stack>
          </Stack>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="button" color="primary">
            Start →
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
