import type { CardProps } from '@mui/material';
import { Card } from '@mui/material';

type ActionCardProps = CardProps;

export function ActionCard ({ sx, children, ...rest }: ActionCardProps) {
    return (
        <Card
            {...rest}
            sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                '&:active': { transform: 'scale(0.97)', opacity: 0.85 },
                ...sx,
            }}
        >
            {children}
        </Card>
    );
}
