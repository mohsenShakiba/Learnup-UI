import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";

const TUTORIAL_SEEN_KEY = "leitner_tutorial_seen";

export function hasTutorialBeenSeen(): boolean {
  return localStorage.getItem(TUTORIAL_SEEN_KEY) === "true";
}

type LeitnerBoxTutorialCardProps = {
  onDismiss: () => void;
};

export function LeitnerBoxTutorialCard({ onDismiss }: LeitnerBoxTutorialCardProps) {
  const handleDismiss = () => {
    localStorage.setItem(TUTORIAL_SEEN_KEY, "true");
    onDismiss();
  };

  return (
    <Card sx={{ p: 3, flex: 1 }} dir="rtl">
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h6" >
            به جعبه لایتنر خود خوش آمدید
          </Typography>
        </Stack>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          <strong>جعبه لایتنر</strong> یک سیستم تکرار فاصله‌دار است که با مرور کلمات در بازه‌های زمانی افزایشی، به شما کمک می‌کند واژگان را به‌طور مؤثر حفظ کنید.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          کلماتی که هنگام مطالعه یا در زمان جستجو ذخیره می‌کنید به‌طور خودکار اینجا ظاهر می‌شوند و بر اساس میزان تسلط شما در سطوح مختلف قرار می‌گیرند.
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Button fullWidth variant="contained" onClick={handleDismiss} sx={{ alignSelf: "flex-end" }}>
          برو به جعبه لایتنر
        </Button>

      </Stack>
    </Card>
  );
}
