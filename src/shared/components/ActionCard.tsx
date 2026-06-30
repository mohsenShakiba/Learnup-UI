import type { CardProps } from '@mui/material';
import { Card } from '@mui/material';
import type { KeyboardEvent } from 'react';

type ActionCardProps = CardProps;

export function ActionCard ({ sx, children, onClick, onKeyDown, role, tabIndex, ...rest }: ActionCardProps) {
    const isInteractive = Boolean(onClick);

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        onKeyDown?.(event);

        if (
            !isInteractive ||
            event.defaultPrevented ||
            event.target !== event.currentTarget ||
            (event.key !== 'Enter' && event.key !== ' ')
        ) {
            return;
        }

        event.preventDefault();
        event.currentTarget.click();
    }

    return (
        <Card
            {...rest}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role={role ?? (isInteractive ? 'button' : undefined)}
            tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
            sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: isInteractive ? 'pointer' : undefined,
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                '&:active': { transform: 'scale(0.97)', opacity: 0.85 },
                ...sx,
            }}
        >
            {children}
        </Card>
    );
}
