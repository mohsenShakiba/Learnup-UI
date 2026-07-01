import { Box, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { UserSubscriptionResponse } from '../../../api/Learnup';
import {
  SubscriptionDuration,
  UserSubscriptionStatus,
} from '../../../api/Learnup';
import { ActionCard } from '../../../shared/components/ActionCard';

const subscriptionsPath = '/settings/subscriptions';

function durationLabel (duration: SubscriptionDuration): string {
  switch (duration) {
    case SubscriptionDuration.LIFETIME: return 'برای همیشه';
    case SubscriptionDuration.ONE_MONTH: return 'یک ماه';
    case SubscriptionDuration.TWELVE_MONTHS: return 'یک ساله';
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
    case UserSubscriptionStatus.ACTIVE: return 'اشتراک فعال';
    case UserSubscriptionStatus.EXPIRED: return 'منقضی شده';
    case UserSubscriptionStatus.CANCELLED: return 'کنسل شده';
  }
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
  const navigate = useNavigate();
  const remaining = timeUntilExpiry(sub.expiresAt, sub.status);

  return (
    <ActionCard
      aria-label="مشاهده لیست اشتراک ها"
      onClick={() => navigate(subscriptionsPath)}
      sx={{ overflow: 'hidden', position: 'relative', p: 2 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 72 }}>
        <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <Stack direction="column" spacing={1} >

            <Typography sx={{ height: 30 }}>{sub.subscriptionTitle}</Typography>

            <Stack direction='row' spacing={0.5} >
              <Chip
                label={statusLabel(sub.status)}
                size="small"
                color={statusColor(sub.status)}
              />
              <Chip label={durationLabel(sub.duration)} size="small" variant="outlined" />
            </Stack>

            {remaining && (
              <Stack direction="row" spacing={0.5} >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>زمان باقی‌مانده</Typography>
                <Typography variant="caption" color="success">{remaining}</Typography>
              </Stack>
            )}

          </Stack>

        </Box>
        <Box
          component="img"
          alt=""
          src="/images/subscriptions/plant.png"
          sx={{
            position: 'absolute',
            bottom: -10,
            right: 25,
            alignSelf: 'end',
            width: 85,
            objectFit: 'contain',
            mr: 1,
            opacity: 0.1
          }}
        />
      </Box>
    </ActionCard>
  );
}

function NoSubscriptionCard () {
  const navigate = useNavigate();
  return (
    <ActionCard
      aria-label="مشاهده لیست اشتراک ها"
      onClick={() => navigate(subscriptionsPath)}
      sx={{ overflow: 'hidden', position: 'relative', p: 2 }}
    >
      <Stack spacing={0.5} sx={{ flex: 1, alignItems: 'start', position: 'relative', zIndex: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          اشتراک پایه
        </Typography>

        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          شما به اشتراک پایه دسترسی دارید.
        </Typography>

        <Box
          component="img"
          alt=""
          src="/images/subscriptions/book.png"
          sx={{
            position: 'absolute',
            bottom: -35,
            right: -35,
            alignSelf: 'end',
            width: 135,
            objectFit: 'contain',
            mr: 1,
            opacity: 0.2
          }}
        />
      </Stack>
    </ActionCard>
  );
}

interface Props {
  subscription: UserSubscriptionResponse | undefined;
}

export function UserSubscriptionCard ({ subscription }: Props) {
  if (!subscription) return <NoSubscriptionCard />;

  return <SubscriptionCardContent sub={subscription} />;
}
