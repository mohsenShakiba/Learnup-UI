const CONFETTI = [
    { x: "6%", c: "var(--ep-gold)", dur: "5.2s", delay: "0.2s" },
    { x: "12%", c: "var(--ep-green)", dur: "4.4s", delay: "1.1s" },
    { x: "18%", c: "var(--ep-coral)", dur: "6.0s", delay: "0.6s" },
    { x: "24%", c: "var(--ep-gold)", dur: "4.8s", delay: "2.0s" },
    { x: "30%", c: "var(--ep-green)", dur: "5.6s", delay: "0.0s" },
    { x: "36%", c: "var(--ep-coral)", dur: "4.2s", delay: "1.6s" },
    { x: "42%", c: "var(--ep-gold)", dur: "5.9s", delay: "0.9s" },
    { x: "49%", c: "var(--ep-green)", dur: "4.6s", delay: "2.4s" },
    { x: "55%", c: "var(--ep-coral)", dur: "5.4s", delay: "0.4s" },
    { x: "61%", c: "var(--ep-gold)", dur: "4.9s", delay: "1.9s" },
    { x: "67%", c: "var(--ep-green)", dur: "6.1s", delay: "0.7s" },
    { x: "73%", c: "var(--ep-coral)", dur: "4.3s", delay: "2.7s" },
    { x: "79%", c: "var(--ep-gold)", dur: "5.7s", delay: "1.3s" },
    { x: "85%", c: "var(--ep-green)", dur: "4.7s", delay: "0.3s" },
    { x: "91%", c: "var(--ep-coral)", dur: "5.5s", delay: "2.1s" },
    { x: "96%", c: "var(--ep-gold)", dur: "4.5s", delay: "1.0s" },
    { x: "9%", c: "var(--ep-green)", dur: "5.8s", delay: "3.0s" },
    { x: "33%", c: "var(--ep-gold)", dur: "5.1s", delay: "3.4s" },
    { x: "58%", c: "var(--ep-coral)", dur: "4.9s", delay: "3.1s" },
    { x: "82%", c: "var(--ep-green)", dur: "5.3s", delay: "3.6s" },
];

export default function ConfettiOverlay () {
    return (
        <div className="ep-confetti" aria-hidden="true">
            {CONFETTI.map((p, i) => (
                <i
                    key={i}
                    style={{ "--x": p.x, "--c": p.c, "--dur": p.dur, "--delay": p.delay } as React.CSSProperties}
                />
            ))}
        </div>
    );
}
