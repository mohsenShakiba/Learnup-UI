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
                    border: '1px solid',
                    borderColor: 'divider',
                    '@keyframes resultCardRise': {
                        from: { transform: 'scale(1.10)', opacity: 0 },
                        to: { transform: 'none', opacity: 1 },
                    },
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    position: 'relative',
                    zIndex: 2,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '26px',
                    padding: '64px 40px 40px',
                    textAlign: 'center',
                    animation: 'resultCardRise .8s cubic-bezier(.2,.9,.25,1) both',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: '14px',
                        border: '1.5px dashed',
                        borderColor: 'divider',
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
                    sx={{
                        position: 'absolute',
                        top: '-50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100px',
                        height: '100px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        bgcolor: 'background.paper',
                        fontSize: '3rem',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {icon}
                </Box>
            )}
            {children}
        </Box>
    );
}
