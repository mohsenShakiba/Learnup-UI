import {
  Box,
  Card,
  CardContent,
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
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              {grammar.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                direction: "rtl",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {grammar.description}
            </Typography>
          </Box>

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

            <Chip
              size="small"
              icon={<Icon>menu_book_rounded</Icon>}
              label={`${grammar.lessons.length} lessons`}
              variant="outlined"
            />
          </Stack>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Order #{grammar.order}
            </Typography>

            <Typography variant="button" color="primary">
              Start →
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
