import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeitnerBoxService, UsersService } from "../../api/Learnup";
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { DotGrid } from "../../shared/components/DotGrid";
import { EmptyList } from "../../shared/components/EmptyList";
import { ErrorPage } from "../../shared/components/ErrorPage";
import { Icon } from '../../shared/components/Icon';
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

          <IconButton onClick={() => setIsSettingsOpen(true)}>
            <Icon>settings</Icon>
          </IconButton>
        </Stack>

        <Box
          sx={{
            bgcolor: "secondary.main",
            position: "relative",
            color: "warning.contrastText",
            borderRadius: 2,
            px: 2.35,
            py: 2.4,
            boxShadow: (theme) =>
              `0 12px 26px ${alpha(theme.palette.warning.main, 0.22)}`,
          }}
        >
          <DotGrid zIndex={1} gap={20} opacity={0.1} color="white" />
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 42,
                  lineHeight: 0.7,
                  fontFamily: 'FredokaOne',
                }}
              >
                {formatNumber(dueItems)}
              </Typography>
              <Typography sx={{ mt: 1.1, fontSize: 18 }}>
                Cards due today
              </Typography>
            </Box>

            <Stack spacing={1.2} sx={{ alignItems: "center" }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 13 }}>
                  {formatNumber(dueLevels.length)} of{" "}
                  {formatNumber(levels.length)} levels
                </Typography>
              </Box>
              <Button
                disabled={!firstDueLevel}
                startIcon={<Icon>arrow_forward</Icon>}
                onClick={() => {
                  navigate(`/boxlevel/${firstDueLevel.id}`);
                }}
                sx={{
                  direction: "ltr",
                  fontFamily: 'arial',
                  bgcolor: (theme) => alpha(theme.palette.warning.contrastText, 0.2),
                  color: "common.white",
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

      <LeitnerBoxSettingsDrawer
        boxId={leitnerBoxQuery.data.id}
        levels={levels}
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </Scaffold>
  );
}
