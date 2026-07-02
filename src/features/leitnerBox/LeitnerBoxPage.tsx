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
import { LeitnerBoxService } from "../../api/Learnup";
import { AppIcon } from '../../shared/components/AppIcon';
import { AppLoader } from "../../shared/components/AppLoader";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { DotGrid } from "../../shared/components/DotGrid";
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
  const levelProgress =
    levels.length === 0
      ? 0
      : dueLevels.length / levels.length;

  return (
    <Scaffold
      header={<DefaultHeader header="لایتنر باکس" />}
    >
      <Stack dir="ltr" spacing={2.15} sx={{ width: "100%", mx: "auto" }}>
        <Stack direction="row" sx={{ alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: 30,
                lineHeight: 1.1,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Leitner box
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13.5,
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
            borderRadius: 3,
            px: 2.5,
            py: 2.6,
            background:
              "linear-gradient(135deg, #7A55E0 0%, #5B34C6 100%)",
            boxShadow: (theme) =>
              `0 16px 30px ${alpha(theme.palette.secondary.main, 0.32)}`,
          }}
        >
          <DotGrid zIndex={1} gap={20} opacity={0.1} color="white" />

          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: "50%",
              right: 20,
              transform: "translateY(-50%)",
              width: 128,
              height: 104,
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 6,
                right: 14,
                width: 92,
                height: 74,
                borderRadius: 3,
                bgcolor: alpha("#ffffff", 0.14),
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 22,
                right: 0,
                width: 110,
                height: 78,
                borderRadius: 3,
                bgcolor: alpha("#ffffff", 0.22),
                display: "grid",
                placeItems: "center",
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 40, height: 40, fill: alpha("#ffffff", 0.7) }}
              >
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
              </Box>
            </Box>
          </Box>

          <Stack
            spacing={1.4}
            sx={{ position: "relative", zIndex: 2, maxWidth: "62%" }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 54,
                  lineHeight: 0.9,
                  fontFamily: 'FredokaOne',
                }}
              >
                {formatNumber(dueItems)}
              </Typography>
              <Typography sx={{ mt: 0.8, fontSize: 18, fontWeight: 600 }}>
                Cards due today
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  height: 5,
                  borderRadius: 999,
                  bgcolor: alpha("#ffffff", 0.25),
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${levelProgress * 100}%`,
                    borderRadius: 999,
                    bgcolor: "common.white",
                    transition: "width 240ms ease",
                  }}
                />
              </Box>
              <Typography sx={{ mt: 0.9, fontSize: 13, opacity: 0.9 }}>
                {formatNumber(dueLevels.length)} of{" "}
                {formatNumber(levels.length)} levels
              </Typography>
            </Box>

            <Button
              disabled={!firstDueLevel}
              endIcon={<AppIcon>arrow_forward</AppIcon>}
              onClick={() => {
                navigate(`/boxlevel/${firstDueLevel.id}`);
              }}
              sx={{
                alignSelf: "flex-start",
                direction: "ltr",
                fontFamily: 'arial',
                fontWeight: 700,
                px: 2.25,
                py: 1,
                borderRadius: 2,
                bgcolor: "common.white",
                color: "secondary.main",
                "&:hover": { bgcolor: alpha("#ffffff", 0.9) },
                "&.Mui-disabled": {
                  bgcolor: alpha("#ffffff", 0.4),
                  color: alpha("#ffffff", 0.8),
                },
              }}
            >
              {firstDueLevel ? "Review now" : "All done"}
            </Button>
          </Stack>
        </Box>

        <Stack spacing={1.15} sx={{ position: "relative" }}>
          {levels.length === 0 ? (
            <EmptyList message="No words in your Leitner box yet. Saved vocabulary will appear here and be grouped by level." />
          ) : (
            <>
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  left: 34,
                  top: 34,
                  bottom: 34,
                  borderLeft: "2px dashed",
                  borderColor: "divider",
                  zIndex: 0,
                }}
              />
              {levels.map((level) => (
                <BoxLevelCard
                  key={level.id}
                  levelId={level.id}
                  level={Number(level.level)}
                  totalItems={level.itemsCount}
                  readyToReview={level.dueItemsCount}
                  reviewInterval={formatReviewInterval(level.willReviewedIn)}
                />
              ))}
            </>
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
