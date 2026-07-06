import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeitnerBoxService } from "../../api/Learnup";
import { AppIcon } from '../../shared/components/AppIcon';
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
  const theme = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const leitnerBoxQuery = useQuery({
    queryKey: ["leitner-box-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
    refetchOnMount: "always",
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

  const dueItems = levels.reduce((sum, level) => sum + level.dueItemsCount, 0);
  const dueLevels = levels.filter((level) => level.dueItemsCount > 0);
  const firstDueLevel = dueLevels[0];

  return (
    <Scaffold
      header={<DefaultHeader header="لایتنر باکس" />}
    >
      <Stack dir="ltr" spacing={2.15} sx={{ width: "100%", mx: "auto" }}>
        <Stack direction="row" sx={{ alignItems: "flex-end", gap: 1.5 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Leitner box
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              Review cards and improve your memory
            </Typography>
          </Box>

          <IconButton
            onClick={() => setIsSettingsOpen(true)}
            sx={{
              bgcolor: "action.hover",
              borderRadius: 2,
              width: 42,
              height: 42,
            }}
          >
            <AppIcon>settings</AppIcon>
          </IconButton>
        </Stack>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            color: "common.white",
            borderRadius: 2,
            p: 2,
            bgcolor: 'primary.main',
          }}
        >

          <Stack direction='row' spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'end' }}>
            <Stack direction='row' sx={{ gap: 1, alignItems: 'end' }}>
              <Typography
                sx={{
                  fontSize: 60,
                  lineHeight: 0.9,
                  fontFamily: 'Roboto',
                }}
              >
                {formatNumber(dueItems)}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                Words<br />
                due today
              </Typography>
            </Stack>

            {
              firstDueLevel ? <Button
                variant="contained"
                startIcon={<AppIcon>arrow_forward</AppIcon>}
                onClick={() => {
                  navigate(`/boxlevel/${firstDueLevel.id}`);
                }}
                sx={{
                  direction: 'ltr',
                  width: 'fit-content',
                  bgcolor: 'white',
                  color: 'primary.main',
                }}
              >
                Review now
              </Button> : <Typography></Typography>
            }
          </Stack>
        </Box>

        <Stack spacing={1} sx={{ position: "relative" }}>
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
