import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const CONFETTI = [
    { x: "6%", c: "var(--confetti-warm)", dur: "5.2s", delay: "0.2s" },
    { x: "12%", c: "var(--confetti-success)", dur: "4.4s", delay: "1.1s" },
    { x: "18%", c: "var(--confetti-accent)", dur: "6.0s", delay: "0.6s" },
    { x: "24%", c: "var(--confetti-primary)", dur: "4.8s", delay: "2.0s" },
    { x: "30%", c: "var(--confetti-success)", dur: "5.6s", delay: "0.0s" },
    { x: "36%", c: "var(--confetti-accent)", dur: "4.2s", delay: "1.6s" },
    { x: "42%", c: "var(--confetti-warm)", dur: "5.9s", delay: "0.9s" },
    { x: "49%", c: "var(--confetti-primary)", dur: "4.6s", delay: "2.4s" },
    { x: "55%", c: "var(--confetti-accent)", dur: "5.4s", delay: "0.4s" },
    { x: "61%", c: "var(--confetti-warm)", dur: "4.9s", delay: "1.9s" },
    { x: "67%", c: "var(--confetti-success)", dur: "6.1s", delay: "0.7s" },
    { x: "73%", c: "var(--confetti-accent)", dur: "4.3s", delay: "2.7s" },
    { x: "79%", c: "var(--confetti-primary)", dur: "5.7s", delay: "1.3s" },
    { x: "85%", c: "var(--confetti-success)", dur: "4.7s", delay: "0.3s" },
    { x: "91%", c: "var(--confetti-accent)", dur: "5.5s", delay: "2.1s" },
    { x: "96%", c: "var(--confetti-warm)", dur: "4.5s", delay: "1.0s" },
    { x: "9%", c: "var(--confetti-success)", dur: "5.8s", delay: "3.0s" },
    { x: "33%", c: "var(--confetti-primary)", dur: "5.1s", delay: "3.4s" },
    { x: "58%", c: "var(--confetti-accent)", dur: "4.9s", delay: "3.1s" },
    { x: "82%", c: "var(--confetti-success)", dur: "5.3s", delay: "3.6s" },
];

const PIECE_STYLES = `
@keyframes ep-fall {
    from { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
    to   { transform: translateY(112vh) rotate(720deg); opacity: 1; }
}
.ep-confetti-piece {
    position: absolute;
    top: -12vh;
    left: var(--x);
    width: 9px; height: 14px;
    background: var(--c);
    opacity: 0;
    border-radius: 1px;
    animation: ep-fall var(--dur) linear var(--delay) infinite;
}
.ep-confetti-piece:nth-child(3n) { width: 7px; height: 7px; border-radius: 50%; }
.ep-confetti-piece:nth-child(4n) { width: 12px; height: 5px; }
`;

export default function ConfettiOverlay () {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        "--confetti-primary": isDark ? theme.palette.primary.light : theme.palette.primary.main,
        "--confetti-success": isDark ? theme.palette.success.light : theme.palette.success.main,
        "--confetti-warm": isDark ? theme.palette.warning.main : theme.palette.warning.dark,
        "--confetti-accent": isDark ? alpha(theme.palette.secondary.main, 0.95) : theme.palette.secondary.main,
    } as React.CSSProperties;

    return (
        <Box
            aria-hidden="true"
            style={colors}
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                zIndex: 1,
                pointerEvents: "none",
            }}
        >
            <style>{PIECE_STYLES}</style>
            {CONFETTI.map((p, i) => (
                <i
                    key={i}
                    className="ep-confetti-piece"
                    style={{ "--x": p.x, "--c": p.c, "--dur": p.dur, "--delay": p.delay } as React.CSSProperties}
                />
            ))}
        </Box>
    );
}
