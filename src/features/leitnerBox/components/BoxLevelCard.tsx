import { alpha, Box, Card, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppIcon } from '../../../shared/components/AppIcon';
import { getLevelTone } from "./levelTone";

type BoxLevelCardProps = {
  levelId: number;
  level: number;
  totalItems: number;
  readyToReview: number;
  reviewInterval: string;
};

const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber (value: number): string {
  return numberFormatter.format(value);
}

function capitalize (value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function BoxLevelCard ({
  levelId,
  level,
  totalItems,
  readyToReview,
  reviewInterval,
}: BoxLevelCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const formattedLevel = formatNumber(level);
  const formattedReady = formatNumber(readyToReview);
  const formattedTotal = formatNumber(totalItems);
  const canReview = readyToReview > 0;
  const tone = getLevelTone(level, theme);

  return (
    <Card
      onClick={() => {
        if (!canReview) return;
        navigate(`/boxlevel/${levelId}`);
      }}
      sx={{
        position: "relative",
        zIndex: 1,
        p: 1.45,
        minHeight: 64,
        borderRadius: 2,
        borderColor: "divider",
        bgcolor: "background.paper",
        cursor: canReview ? "pointer" : "default",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 18px rgba(0, 0, 0, 0.28)"
            : "0 2px 8px rgba(17, 24, 39, 0.06)",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": canReview
          ? {
            transform: "translateY(-2px)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 12px 24px rgba(0, 0, 0, 0.36)"
                : "0 8px 18px rgba(17, 24, 39, 0.1)",
          }
          : undefined,
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1.6 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            flex: "0 0 44px",
            borderRadius: "50%",
            bgcolor: tone.color,
            color: "common.white",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'arial',
          }}
        >
          {formattedLevel}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", minWidth: 0, gap: 1 }}
          >
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.1,
                color: "text.primary",
                whiteSpace: "nowrap",
                fontWeight: 600,
                fontFamily: 'arial',
              }}
            >
              Level {formattedLevel}
            </Typography>
            <Box
              sx={{
                px: 0.85,
                py: 0.2,
                borderRadius: 999,
                bgcolor: tone.softColor,
                color: tone.color,
                fontSize: 10,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}
            >
              {tone.status}
            </Box>
          </Stack>
          <Typography
            sx={{
              mt: 0.55,
              color: "text.secondary",
              fontSize: 11.5,
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {capitalize(reviewInterval)} · {formattedTotal} cards
          </Typography>
        </Box>

        <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
          {canReview ? (
            <Box
              sx={{
                px: 1.35,
                py: 0.6,
                borderRadius: 1.75,
                bgcolor: tone.softColor,
                color: tone.color,
                textAlign: "center",
                minWidth: 40,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
                {formattedReady}
              </Typography>
              <Typography sx={{ fontSize: 11, lineHeight: 1.1, mt: 0.35 }}>
                due
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.14),
                display: "grid",
                placeItems: "center",
              }}
            >
              <AppIcon sx={{ color: "success.main", fontSize: 20 }}>
                check
              </AppIcon>
            </Box>
          )}

          <AppIcon sx={{ color: "text.secondary", fontSize: 22 }}>
            chevron_right
          </AppIcon>
        </Stack>
      </Stack>
    </Card>
  );
}
