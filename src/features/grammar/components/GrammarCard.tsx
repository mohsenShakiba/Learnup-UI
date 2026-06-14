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
import type { GrammarResponse } from "../../../api/Learnup";

type TGrammarCardProps = {
  grammar: GrammarResponse;
};

export default function GrammarCard(props: TGrammarCardProps) {
  const grammar = props.grammar;

  return (
    <Card
      sx={{
        borderRadius: 4,
        cursor: "pointer",
        transition: "0.2s",
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardHeader title={grammar.name} />
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}

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

          {/* Metadata */}
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

          {/* Footer */}
        </Stack>
      </CardContent>
      <CardActionArea>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
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
