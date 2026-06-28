import { Box, Card, Chip, Divider, Icon, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { SubscriptionResponse, UserSubscriptionResponse } from '../../api/Learnup';
import {
  SubscriptionDuration,
  SubscriptionsService,
  SubscriptionType,
  UserSubscriptionStatus,
} from '../../api/Learnup';
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
    <Card variant="outlined">
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Stack>
            <Typography variant="caption" color="text.secondary">Your Plan</Typography>
            <Typography variant="h6">{sub.subscriptionTitle}</Typography>
          </Stack>
          <Stack spacing={0.5} >
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

  return (
    <Card variant={isActive ? 'elevation' : 'outlined'} sx={isActive ? { borderColor: 'primary.main', border: '1px solid' } : {}}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6">{plan.title}</Typography>
          <Stack direction="row" spacing={0.5}>
            <Chip label={typeLabel(plan.type)} size="small" color="primary" />
            <Chip label={durationLabel(plan.duration)} size="small" variant="outlined" />
          </Stack>
        </Stack>

        {plan.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {plan.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="h5" color="primary">
            {discountedPrice.toLocaleString()}
          </Typography>
          {plan.discountPercent > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {plan.price.toLocaleString()}
              </Typography>
              <Chip label={`-${plan.discountPercent}%`} size="small" color="warning" />
            </>
          )}
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <Stack spacing={0.5}>
          {[...plan.features]
            .sort((a, b) => a.order - b.order)
            .map((feature) => (
              <Stack key={feature.id} direction="row" spacing={1} >
                <Icon sx={{ fontSize: 16 }} color={feature.isIncluded ? 'success' : 'disabled'}>
                  {feature.isIncluded ? 'check_circle' : 'cancel'}
                </Icon>
                <Typography variant="body2" color={feature.isIncluded ? 'text.primary' : 'text.secondary'}>
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
