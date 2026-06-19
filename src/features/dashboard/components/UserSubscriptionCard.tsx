import { Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { UserSubscriptionResponse } from '../../../api/Learnup';
import {
  SubscriptionDuration,
  SubscriptionsService,
  UserSubscriptionStatus,
} from '../../../api/Learnup';

function durationLabel (duration: SubscriptionDuration): string {
  switch (duration) {
    case SubscriptionDuration.LIFETIME: return 'Lifetime';
    case SubscriptionDuration.ONE_MONTH: return '1 Month';
    case SubscriptionDuration.TWELVE_MONTHS: return '12 Months';
  }
}

function statusColor (status: UserSubscriptionStatus): 'success' | 'error' | 'default' {
  switch (status) {
    case UserSubscriptionStatus.ACTIVE: return 'success';
    case UserSubscriptionStatus.EXPIRED: return 'error';
    case UserSubscriptionStatus.CANCELLED: return 'default';
  }
}

function statusLabel (status: UserSubscriptionStatus): string {
  switch (status) {
    case UserSubscriptionStatus.ACTIVE: return 'Active';
    case UserSubscriptionStatus.EXPIRED: return 'Expired';
    case UserSubscriptionStatus.CANCELLED: return 'Cancelled';
  }
}

function formatDate (dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function SubscriptionCardContent ({ sub }: { sub: UserSubscriptionResponse; }) {
  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Stack direction="row">
          <Stack>
            <Typography variant="body2" color="text.secondary">Your Plan</Typography>
            <Typography variant="h6" >{sub.subscriptionTitle}</Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Chip
              label={statusLabel(sub.status)}
              size="small"
              color={statusColor(sub.status)}
            />
            <Chip label={durationLabel(sub.duration)} size="small" variant="outlined" />
          </Stack>
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        <Stack direction="row" spacing={3}>
          <Stack>
            <Typography variant="caption" color="text.secondary">Started</Typography>
            <Typography variant="body2">{formatDate(sub.startedAt)}</Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">Expires</Typography>
            <Typography variant="body2">{formatDate(sub.expiresAt)}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

export function UserSubscriptionCard () {
  const { data: sub } = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => SubscriptionsService.getUserCurrentSubscription(),
    retry: false,
  });

  if (!sub) return null;

  return <SubscriptionCardContent sub={sub} />;
}
