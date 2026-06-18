import { Button, Stack, Typography } from "@mui/material";
import { FancyButton } from "../../../shared/components/FancyButton";
import { ResultCard } from "../../../shared/components/ResultCard";
import ConfettiOverlay from "../../VocabTests/components/ConfettiOverlay";

const SCORE_TIERS = [
  {
    min: 90,
    emoji: "🏆",
    label: "trophy",
    title: <>عالی!</>,
    sub: "واقعا کارت فوق‌العاده بود.",
  },
  {
    min: 75,
    emoji: "🎉",
    label: "confetti",
    title: <>خیلی خوب بود!</>,
    sub: "آفرین! بیشتر سوالات رو درست جواب دادی.",
  },
  {
    min: 50,
    emoji: "👍",
    label: "thumbs up",
    title: <>بد نبود!</>,
    sub: "میتونی یک بار دیگر تلاش کنی تا بهتر بشی.",
  },
  {
    min: 0,
    emoji: "💪",
    label: "muscle",
    title: <>متاسفانه خیلی خوب نبود!</>,
    sub: "نگران نباش! با تمرین بیشتر حتماً پیشرفت می کنی.",
  },
];

function getTier (score: number) {
  return SCORE_TIERS.find((t) => score >= t.min)!;
}

export default function GrammarTestResult ({
  score = 0,
  isLoading = false,
  onBack = () => { },
  onRestart = () => { },
}: {
  score?: number;
  isLoading?: boolean;
  onBack?: () => void;
  onRestart?: () => void;
}) {
  const tier = getTier(score);

  return (
    <Stack sx={{ height: '100%', alignItems: 'stretch', m: 4, justifyContent: 'center' }}>
      <ConfettiOverlay />

      <ResultCard sx={{ position: 'relative' }} icon={tier.emoji} iconLabel={tier.label}>

        <Stack direction="column" spacing={2}>

          <Typography variant="h1" sx={{ color: "text.primary" }}>
            {tier.title}
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {tier.sub}
          </Typography>

          <Typography variant="h1" sx={{ lineHeight: 1 }}>
            {score}٪
          </Typography>

          <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
            نمره
          </Typography>

          <Button variant="outlined" onClick={onRestart} disabled={isLoading} sx={{ borderRadius: 999 }}>
            شروع دوباره آزمون
          </Button>

          <FancyButton onClick={onBack} disabled={isLoading} sx={{ borderRadius: 999 }}>
            بازگشت
          </FancyButton>

        </Stack>

      </ResultCard>
    </Stack>
  );
}
