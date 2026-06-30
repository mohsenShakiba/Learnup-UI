import SettingsIcon from "@mui/icons-material/Settings";
import {
  alpha,
  Box,
  Button,
  Fab,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeitnerBoxService, UsersService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Scaffold } from "../../shared/components/Scaffold";
import { BoxLevelCard } from "./components/BoxLevelCard";
import { LeitnerBoxSettingsDrawer } from "./components/LeitnerBoxSettingsDrawer";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber (value: number): string {
  return numberFormatter.format(value);
}

function getIntervalDays (value: string): number {
  const dayPart = value.match(/^(-?\d+)\./);
  if (dayPart) {
    return Number(dayPart[1]);
  }

  const parts = value.match(/\d+/g);
  if (!parts || parts.length === 0) {
    return 0;
  }

  if (parts.length >= 3 && value.includes(":")) {
    return 0;
  }

  return Number(parts[0]);
}

function formatReviewInterval (value: string): string {
  const days = getIntervalDays(value);

  if (days <= 0) {
    return "today";
  }

  if (days === 1) {
    return "every day";
  }

  if (days === 365) {
    return "every year";
  }

  if (days % 30 === 0) {
    const months = days / 30;
    return months === 1 ? "every month" : `every ${months} months`;
  }

  if (days % 7 === 0) {
    const weeks = days / 7;
    return weeks === 1 ? "every week" : `every ${weeks} weeks`;
  }

  return `every ${days} days`;
}

export default function LeitnerBoxPage () {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const leitnerBoxQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
    refetchOnMount: "always",
  });

  const streakQuery = useQuery({
    queryKey: ["user", "streak"],
    queryFn: () => UsersService.getUserStreaks(),
    retry: false,
  });

  const levels = useMemo(
    () =>
      [...(leitnerBoxQuery.data?.levels ?? [])].sort(
        (left, right) => Number(left.level) - Number(right.level),
      ),
    [leitnerBoxQuery.data?.levels],
  );

  if (leitnerBoxQuery.isLoading) {
    return <AppLoader />;
  }

  if (leitnerBoxQuery.isError || !leitnerBoxQuery.data) {
    return <ErrorPage onAction={() => void leitnerBoxQuery.refetch()} />;
  }

  const totalItems = levels.reduce((sum, level) => sum + level.itemsCount, 0);
  const dueItems = levels.reduce((sum, level) => sum + level.dueItemsCount, 0);
  const dueLevels = levels.filter((level) => level.dueItemsCount > 0);
  const firstDueLevel = dueLevels[0];
  const currentStreak = streakQuery.data?.currentStreak ?? 0;

  return (
    <Scaffold
      header={<DefaultHeader header="لایتنر باکس" />}
    >
      <Stack dir="ltr" spacing={2.15} sx={{ width: "100%", mx: "auto" }}>
        <Stack direction="row" sx={{ alignItems: "end", gap: 1.5 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: 30,
                lineHeight: 1,
                color: "text.primary",
              }}
            >
              Leitner box
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              bgcolor: "warning.main",
              color: "warning.contrastText",
              position: "relative",
              gap: 0.25,
              fontSize: 13,
              boxShadow: (theme) =>
                `0 8px 18px ${alpha(theme.palette.warning.main, 0.24)}`,
            }}
          >
            <Icon
              sx={{
                fontSize: 17,
                position: "absolute",
                top: "50%",
                right: "50%",
                transform: "translate(85%, -60%)",
              }}
            >
              local_fire_department
            </Icon>
            <span
              style={{
                position: "absolute",
                top: "50%",
                right: "50%",
                transform: "translate(140%, -40%)",
              }}
            >
              {formatNumber(currentStreak)}
            </span>
          </Box>
        </Stack>

        <Box
          sx={{
            bgcolor: "warning.main",
            color: "warning.contrastText",
            borderRadius: 3.2,
            px: 2.35,
            py: 2.4,
            boxShadow: (theme) =>
              `0 12px 26px ${alpha(theme.palette.warning.main, 0.22)}`,
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "Georgia, Merriweather, serif",
                  fontSize: 42,
                  lineHeight: 0.9,
                }}
              >
                {formatNumber(dueItems)}
              </Typography>
              <Typography sx={{ mt: 1.1, fontSize: 12.5, fontWeight: 900 }}>
                cards due today
              </Typography>
            </Box>

            <Stack spacing={1.2} sx={{ alignItems: "flex-end" }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 900 }}>
                  {formatNumber(dueLevels.length)} of{" "}
                  {formatNumber(levels.length)} levels
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize: 12,
                    fontWeight: 800,
                    opacity: 0.82,
                  }}
                >
                  {formatNumber(totalItems)} cards total
                </Typography>
              </Box>
              <Button
                disabled={!firstDueLevel}
                onClick={() => {
                  if (!firstDueLevel) {
                    return;
                  }

                  navigate(`/boxlevel/${firstDueLevel.id}`);
                }}
                endIcon={<Icon>arrow_forward</Icon>}
                sx={{
                  minHeight: 36,
                  borderRadius: 999,
                  px: 2,
                  bgcolor: (theme) =>
                    alpha(theme.palette.warning.contrastText, 0.2),
                  color: "warning.contrastText",
                  fontSize: 12,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: (theme) =>
                      alpha(theme.palette.warning.contrastText, 0.28),
                  },
                  "&.Mui-disabled": {
                    bgcolor: (theme) =>
                      alpha(theme.palette.warning.contrastText, 0.16),
                    color: (theme) =>
                      alpha(theme.palette.warning.contrastText, 0.72),
                  },
                  "& .MuiButton-endIcon": {
                    ml: 0.45,
                  },
                }}
              >
                {firstDueLevel ? "Review now" : "All done"}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={1.15}>
          {levels.length === 0 ? (
            <EmptyList message="No words in your Leitner box yet. Saved vocabulary will appear here and be grouped by level." />
          ) : (
            levels.map((level) => (
              <BoxLevelCard
                key={level.id}
                levelId={level.id}
                level={Number(level.level)}
                totalItems={level.itemsCount}
                readyToReview={level.dueItemsCount}
                reviewInterval={formatReviewInterval(level.willReviewedIn)}
              />
            ))
          )}
        </Stack>
      </Stack>

      <Fab
        color="primary"
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Open Leitner settings"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 81,
        }}
      >
        <SettingsIcon />
      </Fab>

      <LeitnerBoxSettingsDrawer
        boxId={leitnerBoxQuery.data.id}
        levels={levels}
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Scaffold>
  );
}
