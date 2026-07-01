import { alpha, Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { SubscriptionResponse, UserSubscriptionResponse } from '../../api/Learnup';
import {
  SubscriptionDuration,
  SubscriptionsService,
  SubscriptionType,
  UserSubscriptionStatus,
} from '../../api/Learnup';
import { AppIcon } from '../../shared/components/AppIcon';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { ErrorPage } from '../../shared/components/ErrorPage';
import { Scaffold } from '../../shared/components/Scaffold';

function durationLabel (duration: SubscriptionDuration): string {
  switch (duration) {
    case SubscriptionDuration.LIFETIME: return 'Lifetime';
    case SubscriptionDuration.ONE_MONTH: return '1 Month';
    case SubscriptionDuration.TWELVE_MONTHS: return '12 Months';
  }
}

function typeLabel (type: SubscriptionType): string {
  switch (type) {
    case SubscriptionType.BASIC: return 'Basic';
    case SubscriptionType.STANDARD: return 'Standard';
    case SubscriptionType.PRO: return 'Pro';
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

function CurrentPlanCard ({ sub }: { sub: UserSubscriptionResponse; }) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 0,
        overflow: 'hidden',
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.32),
      }}
    >
      <Box
        sx={{
          p: 2,
          borderLeft: '4px solid',
          borderColor: 'primary.main',
        }}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
          <Stack spacing={0.35} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">Current plan</Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.15 }}>{sub.subscriptionTitle}</Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
            <Chip label={statusLabel(sub.status)} size="small" color={statusColor(sub.status)} />
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

function PlanCard ({ plan, isActive }: { plan: SubscriptionResponse; isActive: boolean; }) {
  const discountedPrice = plan.discountPercent > 0
    ? plan.price * (1 - plan.discountPercent / 100)
    : plan.price;
  const sortedFeatures = [...plan.features].sort((a, b) => a.order - b.order);

  return (
    <Card
      variant="outlined"
      sx={{
        p: 0,
        overflow: 'hidden',
        borderColor: isActive ? 'primary.main' : 'divider',
        boxShadow: isActive
          ? (theme) => `0 10px 24px ${alpha(theme.palette.primary.main, 0.12)}`
          : 'none',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1.25 }}>
          <Stack spacing={0.65} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ lineHeight: 1.15 }}>{plan.title}</Typography>
              {isActive && <Chip label="Active" size="small" color="success" />}
            </Stack>
            {plan.description && (
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                {plan.description}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip label={typeLabel(plan.type)} size="small" color="primary" variant={isActive ? 'filled' : 'outlined'} />
            <Chip label={durationLabel(plan.duration)} size="small" variant="outlined" />
          </Stack>
        </Stack>

        <Box
          sx={{
            my: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.07),
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
            <Typography variant="h5" color="primary" sx={{ lineHeight: 1 }}>
              {Math.round(discountedPrice).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              تومان
            </Typography>
          </Stack>
          {plan.discountPercent > 0 && (
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mt: 0.75 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {plan.price.toLocaleString()}
              </Typography>
              <Chip label={`-${plan.discountPercent}%`} size="small" color="warning" />
            </Stack>
          )}
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <Stack spacing={0.9}>
          {sortedFeatures.map((feature) => (
            <Stack key={feature.id} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
              <AppIcon sx={{ fontSize: 18, mt: 0.15 }} color={feature.isIncluded ? 'success' : 'disabled'}>
                {feature.isIncluded ? 'check_circle' : 'remove_circle'}
              </AppIcon>
              <Typography
                variant="body2"
                color={feature.isIncluded ? 'text.primary' : 'text.secondary'}
                sx={{ lineHeight: 1.45 }}
              >
                {feature.description}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

export default function SubscriptionsPage () {
  const plansQuery = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => SubscriptionsService.getSubscriptions(),
  });

  const userSubQuery = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => SubscriptionsService.getUserCurrentSubscription(),
    retry: false,
  });

  if (plansQuery.isLoading) {
    return <AppLoader />;
  }

  if (plansQuery.isError) {
    return <ErrorPage onAction={() => void plansQuery.refetch()} />;
  }

  const plans = plansQuery.data ?? [];
  const userSub = userSubQuery.data;

  return (
    <Scaffold header={<DefaultHeader header="Subscriptions" />}>
      <Stack spacing={2}>
        {userSub && <CurrentPlanCard sub={userSub} />}

        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isActive={userSub?.subscriptionId === plan.id && userSubQuery.isSuccess}
          />
        ))}
      </Stack>
    </Scaffold>
  );
}
