import { Button, Card, Stack, Typography } from "@mui/material";

type ReviewCompletedCardProps = {
  reviewedCount: number;
  onBackToBox: () => void;
};

export function ReviewCompletedCard ({
  reviewedCount,
  onBackToBox,
}: ReviewCompletedCardProps) {
  return (
    <Card sx={{ borderRadius: 2, p: 2 }}>
      <Stack spacing={2} sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          مرور این سطح کامل شد
        </Typography>
        <Typography color="text.secondary">
          شما {reviewedCount} واژه را در این سطح مرور کردید.
        </Typography>
        <Button variant="contained" onClick={onBackToBox}>
          بازگشت به جعبه‌ی لایتنر
        </Button>
      </Stack>
    </Card>
  );
}
