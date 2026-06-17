import { Box, type BoxProps } from "@mui/material";

type ResultCardProps = BoxProps & {
    icon?: string;
    iconLabel?: string;
};

export function ResultCard ({ icon, iconLabel, sx, children, ...props }: ResultCardProps) {
    return (
        <Box
            {...props}
            sx={[
                {
                    '@keyframes resultCardRise': {
                        from: { transform: 'translateY(34px) scale(.96)', opacity: 0 },
                        to: { transform: 'none', opacity: 1 },
                    },
                    '@keyframes resultCardStamp': {
                        from: { transform: 'scale(2.4) rotate(-22deg)', opacity: 0 },
                        to: { transform: 'none', opacity: 1 },
                    },
                    position: 'relative',
                    zIndex: 2,
                    width: 'min(440px, 100%)',
                    background: 'linear-gradient(180deg, #fbf7ef, #f7efe1)',
                    border: '1px solid #f0e7d6',
                    borderRadius: '26px',
                    padding: '64px 40px 40px',
                    textAlign: 'center',
                    boxShadow: '0 40px 80px -30px rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.7) inset',
                    animation: 'resultCardRise .8s cubic-bezier(.2,.9,.25,1) both',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: '14px',
                        border: '1.5px dashed rgba(169,120,26,.35)',
                        borderRadius: '16px',
                        pointerEvents: 'none',
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                        animation: 'none',
                    },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {icon && (
                <Box
                    aria-label={iconLabel}
                    sx={{
                        position: 'absolute',
                        top: '-46px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '92px',
                        height: '92px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        background: '#fbf7ef',
                        boxShadow: '0 0 0 6px #fbf7ef, 0 0 0 8px rgba(169,120,26,.25)',
                        fontSize: '3rem',
                        animation: 'resultCardStamp .7s cubic-bezier(.18,1.4,.4,1) .35s both',
                        '@media (prefers-reduced-motion: reduce)': {
                            animation: 'none',
                        },
                    }}
                >
                    {icon}
                </Box>
            )}
            {children}
        </Box>
    );
}
