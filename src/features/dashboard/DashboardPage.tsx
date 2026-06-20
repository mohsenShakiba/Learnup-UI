import { Fade, Stack } from '@mui/material';
import { Scaffold } from '../../shared/components/Scaffold';
import { ContinueCard } from './components/ContinueCard';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';
import { useDashboardData } from './hooks/useDashboardData';

export default function DashboardPage () {
  const { streak, subscription, isLoading } = useDashboardData();

  if (isLoading) return null;

  return (
    <Scaffold >
      <Stack spacing={2}>
        <Fade in timeout={600}>
          <div><ContinueCard /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
          <div><StreakCardBlaze streak={streak} /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '600ms' }}>
          <div><UserSubscriptionCard subscription={subscription} /></div>
        </Fade>
      </Stack>
    </Scaffold>
  );
}
