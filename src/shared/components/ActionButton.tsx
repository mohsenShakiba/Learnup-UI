import { Box, Icon, type SxProps, type Theme } from '@mui/material';

type Props = {
    pendingText: string;
    completedText: string;
    isCompleted: boolean;
    onClick?: () => void;
    sx?: SxProps<Theme>;
};

const ENERGETIC_GRADIENT = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
const ENERGETIC_COLOR = '#d97706';
const DONE_COLOR = '#587a50';

export function ActionButton({ pendingText, completedText, isCompleted, onClick, sx }: Props) {
    return (
        <Box
            onClick={onClick}
            sx={[
                {
                    '@keyframes arrowBounce': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '50%': { transform: 'translateX(-5px)' },
                    },
                    '@keyframes iconShine': {
                        '0%': { left: '120%' },
                        '35%': { left: '-60%' },
                        '100%': { left: '-60%' },
                    },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    userSelect: 'none',
                    border: `1px solid ${isCompleted ? `${DONE_COLOR}55` : `${ENERGETIC_COLOR}70`}`,
                    transition: 'transform 0.15s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                    '&:active': { transform: 'scale(0.97)' },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {/* Text section */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.5,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'hidden',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isCompleted ? DONE_COLOR : 'text.primary',
                    transition: 'color 0.4s ease',
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {isCompleted ? completedText : pendingText}
                </Box>
            </Box>

            {/* Icon section — diagonal left edge via clip-path */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 56,
                    px: 1.5,
                    background: isCompleted ? DONE_COLOR : ENERGETIC_GRADIENT,
                    overflow: 'hidden',
                    transition: 'background 0.4s ease',
                    clipPath: 'polygon(0% 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%)',
                    // Shine sweep animation on pending state
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '120%',
                        width: '45%',
                        height: '100%',
                        transform: 'skewX(-18deg)',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)',
                        animation: isCompleted ? 'none' : 'iconShine 2.4s ease-in-out infinite',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Icon
                    sx={{
                        color: 'white',
                        fontSize: '1.25rem',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'transform 0.3s ease',
                        animation: isCompleted ? 'none' : 'arrowBounce 1.1s ease-in-out infinite',
                    }}
                >
                    {isCompleted ? 'check_circle' : 'arrow_backward'}
                </Icon>
            </Box>
        </Box>
    );
}
