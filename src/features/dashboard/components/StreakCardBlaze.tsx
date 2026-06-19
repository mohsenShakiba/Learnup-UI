import {
  Box,
  Card,
  Stack,
  Typography
} from "@mui/material";

import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

interface StreakCardBlazeProps {
  streakCount?: number;
  nextMilestone?: number;
  bestStreak?: number;
  weekActivity?: boolean[];
  weekLabels?: string[];
}

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer],
});

export function StreakCardBlaze ({
  streakCount = 12,
  nextMilestone = 14,
  bestStreak = 18,
  weekActivity,
  weekLabels = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
}: StreakCardBlazeProps) {
  const milestone = Math.max(streakCount + 1, nextMilestone);
  const daysToGo = Math.max(0, milestone - streakCount);
  const pct = Math.min(100, Math.round((streakCount / Math.max(1, milestone)) * 100));

  const activeCount = Math.min(7, streakCount);
  const days = weekLabels.map((d, i) => ({
    d,
    active: weekActivity ? !!weekActivity[i] : i >= 7 - activeCount,
    today: i === weekLabels.length - 1,
  }));



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
            background: 'rgba(255,255,255,0.5)',
            width: '45px',
            height: '45px',
            lineHeight: '50px',
            textAlign: 'center'
          }}>
            🔥
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
              تا حالا کاری نکردی
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
                  fontSize: 16,
                  bgcolor: b.active ? "rgba(255,255,255,.95)" : "rgba(0,0,0,.3)",
                  boxShadow: b.today ? "0 0 0 2px rgba(255,255,255,.95)" : "none",
                }}
              >
                {b.active ? "🔥" : "12"}
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>{b.d[0]}</Typography>
            </Box>
          ))}
        </Box>

      </Stack>
    </Card>
  );
}
