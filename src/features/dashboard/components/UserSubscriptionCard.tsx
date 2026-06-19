import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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

function timeUntilExpiry (expiresAt: string, status: UserSubscriptionStatus): string | null {
  if (status !== UserSubscriptionStatus.ACTIVE) return null;
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const parts: string[] = [];
  if (months > 0) parts.push(`${months} ماه`);
  if (days > 0 || parts.length === 0) parts.push(`${days} روز`);
  return parts.join(' و ');
}

function SubscriptionCardContent ({ sub }: { sub: UserSubscriptionResponse; }) {
  const remaining = timeUntilExpiry(sub.expiresAt, sub.status);

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Stack direction="row">
          <Stack>
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
          {remaining && (
            <Stack>
              <Typography variant="caption" color="text.secondary">زمان باقی‌مانده</Typography>
              <Typography variant="body2" color="success.main">{remaining}</Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </Card>
  );
}

function NoSubscriptionCard () {
  const navigate = useNavigate();
  return (
    <Card>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" gutterBottom>
          اشتراک پایه
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          با اشتراک پایه میتونی روزی
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate('/settings/subscriptions')}
        >
          مشاهده لیست اشتراک ها
        </Button>
      </Box>
    </Card>
  );
}

export function UserSubscriptionCard () {
  const { data: sub, isLoading } = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => SubscriptionsService.getUserCurrentSubscription(),
    retry: false,
  });

  if (isLoading) return null;
  if (!sub) return <NoSubscriptionCard />;

  return <SubscriptionCardContent sub={sub} />;
}
