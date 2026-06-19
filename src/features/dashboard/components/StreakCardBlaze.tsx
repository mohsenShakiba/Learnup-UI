import {
  Box,
  Card,
  Stack,
  Typography
} from "@mui/material";


interface StreakCardBlazeProps {
  streakCount?: number;
  weekActivity?: boolean[];
  weekLabels?: string[];
  weekDates?: number[];
  todayIndex?: number;
}

function getStreakIcon (streakCount: number): string {
  if (streakCount === 0) return "🎓";
  if (streakCount <= 1) return "👍";
  if (streakCount <= 2) return "⚡";
  if (streakCount <= 3) return "👌";
  if (streakCount <= 4) return "👏";
  if (streakCount <= 5) return "🍾";
  if (streakCount <= 5) return "🥳";
  return "🎉";
}

function getStreakCaption (streakCount: number): string {
  if (streakCount === 0) return "هنوز شروع نکردی!";
  if (streakCount <= 1) return "شروع خوبیه!";
  if (streakCount <= 2) return "داری خوب ادامه میدی!";
  if (streakCount <= 6) return "داری پیشرفت می‌کنی!";
  if (streakCount <= 13) return "یک هفته کامل!";
  if (streakCount <= 29) return "دو هفته، محشره!";
  return "یه ماه! افسانه‌ای!";
}

export function StreakCardBlaze ({
  streakCount = 12,
  weekActivity,
  weekLabels = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
  weekDates,
  todayIndex,
}: StreakCardBlazeProps) {
  const resolvedTodayIndex = todayIndex ?? weekLabels.length - 1;
  const activeCount = Math.min(7, streakCount);
  const days = weekLabels.map((d, i) => ({
    d,
    active: weekActivity ? !!weekActivity[i] : i >= 7 - activeCount,
    today: i === resolvedTodayIndex,
    isPast: i < resolvedTodayIndex,
    date: weekDates?.[i],
  }));

  function getCellContent (day: typeof days[0]): string {
    if (day.active) return "🔥";
    if (day.isPast) return "❄️";
    return day.date != null ? String(day.date) : "";
  }

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        background: "linear-gradient(155deg, rgb(255, 154, 61) 0%, rgb(255, 87, 34) 52%, rgb(229, 56, 59) 100%)",
        color: "#fff",
      }}
    >

      <Stack spacing={3}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          <Typography sx={{
            fontSize: 30,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.75)',
            width: '45px',
            height: '45px',
            lineHeight: '50px',
            textAlign: 'center'
          }}>
            {getStreakIcon(streakCount)}
          </Typography>

          <Stack>
            <Typography>
              روزهای استفاده مداوم
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                opacity: '0.8'
              }}
            >
              {getStreakCaption(streakCount)}
            </Typography>
          </Stack>
        </Box>

        {/* Count */}
        <Box sx={{ display: "flex", alignItems: "end", direction: 'rtl', gap: 1 }}>
          <Typography
            sx={{
              fontFamily: "FredokaOne",
              fontSize: 60,
              lineHeight: 0.85,
              textShadow: '0 0 10px rgba(0,0,0,0.4)',
            }}
          >
            {streakCount}
          </Typography>
          <Typography sx={{
            fontFamily: "FredokaOne",
            fontSize: 16,
            lineHeight: '20px',
            textShadow: '0 0 10px rgba(0,0,0,0.4)'
          }}>
            DAYS
            <br />
            IN A ROW
          </Typography>
        </Box>

        {/* Week cells */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: "22px", mb: "20px" }}>
          {days.map((b, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px" }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: b.active || b.isPast ? 16 : 13,
                  fontWeight: 700,
                  bgcolor: b.active ? "rgba(255,255,255,.95)" : "rgba(0,0,0,.3)",
                  boxShadow: b.today ? "0 0 0 2px rgba(255,255,255,.95)" : "none",
                }}
              >
                {getCellContent(b)}
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>{b.d[0]}</Typography>
            </Box>
          ))}
        </Box>

      </Stack>
    </Card>
  );
}
