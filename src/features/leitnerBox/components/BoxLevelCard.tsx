import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormatNumber from "../../../utils/NumberFmt";

type BoxLevelCardProps = {
  level: number;
  totalItems: number;
  readyToReview: number;
};

export function BoxLevelCard({
  level,
  totalItems,
  readyToReview,
}: BoxLevelCardProps) {
  const navigate = useNavigate();
  const formattedLevel = FormatNumber(level);
  const formattedReady = FormatNumber(readyToReview);
  const formattedTotal = FormatNumber(totalItems);

  return (
    <Card
      onClick={() => navigate(`/boxlevel/${level}`)}
      sx={{
        p: 2.25,
        cursor: "pointer",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
              مرحله {formattedLevel}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Chip
            label={`${formattedReady} آماده مرور`}
            color={readyToReview > 0 ? "warning" : "default"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`${formattedTotal} کل واژگان`}
            color={readyToReview > 0 ? "warning" : "default"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
