import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { UserSubscriptionResponse } from '../../../api/Learnup';
import {
  SubscriptionDuration,
  UserSubscriptionStatus,
} from '../../../api/Learnup';
import { FancyButton } from '../../../shared/components/FancyButton';

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
  const remaining = timeUntilExpiry(sub.expiresAt, sub.status);

  console.log('duration', sub.duration);

  return (
    <Card sx={{ overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="column" spacing={1} >

            <Typography variant="h6" sx={{ height: 30 }}>{sub.subscriptionTitle}</Typography>

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
    </Card>
  );
}

function NoSubscriptionCard () {
  const navigate = useNavigate();
  return (
    <Card sx={{ overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ flex: 1, textAlign: 'start' }}>
        <Typography variant="body2" gutterBottom>
          اشتراک پایه
        </Typography>
        <FancyButton
          variant="contained"
          size="small"
          onClick={() => navigate('/settings/subscriptions')}
        >
          مشاهده لیست اشتراک ها
        </FancyButton>

        <Box
          component="img"
          src="/images/subscriptions/book.png"
          sx={{
            position: 'absolute',
            bottom: -25,
            right: -25,
            alignSelf: 'end',
            width: 135,
            objectFit: 'contain',
            mr: 1,
            opacity: 0.2
          }}
        />
      </Box>
    </Card>
  );
}

interface Props {
  subscription: UserSubscriptionResponse | undefined;
}

export function UserSubscriptionCard ({ subscription }: Props) {
  if (!subscription) return <NoSubscriptionCard />;

  return <SubscriptionCardContent sub={subscription} />;
}
