import { Card } from '@mui/material';
import type { CardProps } from '@mui/material';

type ActionCardProps = CardProps;

export function ActionCard ({ sx, children, ...rest }: ActionCardProps) {
    return (
        <Card
            {...rest}
            sx={{
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
