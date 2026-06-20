import { useQuery } from '@tanstack/react-query';
import { SubscriptionsService, UsersService } from '../../../api/Learnup';

export function useDashboardData () {
  const streakQuery = useQuery({
    queryKey: ['user', 'streak'],
    queryFn: () => UsersService.getUserStreaks(),
    retry: false,
  });

  const subscriptionQuery = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => SubscriptionsService.getUserCurrentSubscription(),
    retry: false,
  });

  return {
    streak: streakQuery.data,
    subscription: subscriptionQuery.data,
    isLoading: streakQuery.isLoading || subscriptionQuery.isLoading,
    isError: streakQuery.isError || subscriptionQuery.isError,
  };
}
