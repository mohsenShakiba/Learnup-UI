
/**
 * ExamPassedCard — a reusable RTL (Farsi) "exam passed" result screen.
 *
 * Props:
 *   score      {number}    The score to display (0–100). Shown with Persian digits. Default: 0
 *   onBack     {function}  Called when the "بازگشت" (Back) button is pressed.
 *   onRestart  {function}  Called when the "شروع دوبارهٔ آزمون" (Restart exam) button is pressed.
 *
 * Usage:
 *   <ExamPassedCard score={92} onBack={goHome} onRestart={retakeExam} />
 */

import { Box, Button, Stack, Typography } from "@mui/material";
import { FancyButton } from "../../../shared/components/FancyButton";
import ConfettiOverlay from "./ConfettiOverlay";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const toPersianDigits = (value) =>
    String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[d]);

const STYLES = `
.ep-root{
  --ep-ink:        #16223a;
  --ep-cream:      #fbf7ef;
  --ep-cream-edge: #f0e7d6;
  --ep-gold:       #d8a32f;
  --ep-gold-deep:  #a9781a;
  --ep-green:      #2f9e6b;
  --ep-green-deep: #1f7a51;
  --ep-coral:      #e8694e;
  --ep-muted:      #6b7488;

  direction:rtl;
  min-height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:32px 20px;
  position:relative;
  overflow:hidden;
  font-family:"IranSans", system-ui, sans-serif;
  background:radial-gradient(120% 90% at 50% -10%, #2c4068 0%, var(--ep-ink) 55%, #0e1729 100%);
}

.ep-root::before{
  content:"";
  position:absolute;
  width:560px; height:560px;
  background:radial-gradient(circle, rgba(216,163,47,.22), transparent 65%);
  border-radius:50%;
  z-index:0;
  animation:ep-breathe 7s ease-in-out infinite;
}
@keyframes ep-breathe{ 50%{ transform:scale(1.08); opacity:.85; } }

.ep-confetti{ position:absolute; inset:0; overflow:hidden; z-index:1; pointer-events:none; }
.ep-confetti i{
  position:absolute;
  top:-12vh;
  left:var(--x);
  width:9px; height:14px;
  background:var(--c);
  opacity:0;
  border-radius:1px;
  animation:ep-fall var(--dur) linear var(--delay) infinite;
}
.ep-confetti i:nth-child(3n){ width:7px; height:7px; border-radius:50%; }
.ep-confetti i:nth-child(4n){ width:12px; height:5px; }
@keyframes ep-fall{
  0%   { transform:translateY(-10vh) rotate(0deg); opacity:0; }
  8%   { opacity:1; }
  100% { transform:translateY(112vh) rotate(720deg); opacity:1; }
}

.ep-card{
  position:relative;
  z-index:2;
  width:min(440px, 100%);
  background:linear-gradient(180deg, var(--ep-cream), #f7efe1);
  border:1px solid var(--ep-cream-edge);
  border-radius:26px;
  padding:64px 40px 40px;
  text-align:center;
  box-shadow:0 40px 80px -30px rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.7) inset;
  animation:ep-rise .8s cubic-bezier(.2,.9,.25,1) both;
}
@keyframes ep-rise{
  from{ transform:translateY(34px) scale(.96); opacity:0; }
  to  { transform:translateY(0) scale(1); opacity:1; }
}
.ep-card::before{
  content:"";
  position:absolute;
  inset:14px;
  border:1.5px dashed rgba(169,120,26,.35);
  border-radius:16px;
  pointer-events:none;
}

.ep-emoji-wrap{ position:absolute; top:-46px; left:50%; transform:translateX(-50%); }
.ep-emoji{
  width:92px; height:92px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:var(--ep-cream);
  box-shadow:0 0 0 6px var(--ep-cream), 0 0 0 8px rgba(169,120,26,.25);
  font-size:3rem;
  animation:ep-stamp .7s cubic-bezier(.18,1.4,.4,1) .35s both;
}
@keyframes ep-stamp{
  0%  { transform:scale(2.4) rotate(-22deg); opacity:0; }
  60% { opacity:1; }
  100%{ transform:scale(1) rotate(0deg); opacity:1; }
}

.ep-title{
  font-weight:700;
  font-size:2.6rem;
  line-height:1.25;
  color:var(--ep-ink);
  margin:16px 0 4px;
}
.ep-title em{ font-style:normal; color:var(--ep-green-deep); }

.ep-sub{
  color:var(--ep-muted);
  font-size:1.02rem;
  max-width:32ch;
  margin:10px auto 0;
  line-height:1.7;
}

.ep-score{
  margin:26px auto 4px;
  padding:16px 0;
  border-top:1px solid var(--ep-cream-edge);
  border-bottom:1px solid var(--ep-cream-edge);
}
.ep-score b{
  display:block;
  font-size:2.4rem;
  font-weight:700;
  color:var(--ep-ink);
  line-height:1;
}
.ep-score span{
  display:block;
  margin-top:6px;
  font-size:.78rem;
  letter-spacing:.16em;
  color:var(--ep-muted);
}

.ep-actions{
  display:flex;
  justify-content:center;
  gap:12px;
  margin-top:26px;
  flex-wrap:wrap;
}

@media (max-width:420px){
  .ep-card{ padding:58px 22px 32px; }
  .ep-title{ font-size:2.1rem; }
}

@media (prefers-reduced-motion:reduce){
  .ep-root *{ animation:none !important; }
  .ep-check{ stroke-dashoffset:0; }
  .ep-seal{ transform:rotate(-8deg); }
}
`;

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

export default function ExamPassedCard ({
    score = 0,
    onBack = () => { },
    onRestart = () => { },
}) {
    const tier = getTier(score);

    return (
        <Box className="ep-root" sx={{ flex: 1 }}>
            <style>{STYLES}</style>

            <ConfettiOverlay />

            {/* card */}
            <Box component="main" className="ep-card" role="status" aria-live="polite">
                <Box className="ep-emoji-wrap">
                    <Box className="ep-emoji" aria-label={tier.label}>{tier.emoji}</Box>
                </Box>

                <Typography component="h1" className="ep-title">
                    {tier.title}
                </Typography>
                <Typography component="p" className="ep-sub">
                    {tier.sub}
                </Typography>

                <Box className="ep-score">
                    <Typography component="b">{toPersianDigits(score)}٪</Typography>
                    <Typography component="span">نمره</Typography>
                </Box>

                <Stack direction="column" className="ep-actions">
                    <Button variant="outlined" onClick={onRestart}>
                        شروع دوباره آزمون
                    </Button>
                    <FancyButton onClick={onBack}>
                        بازگشت
                    </FancyButton>
                </Stack>
            </Box>
        </Box>
    );
}
