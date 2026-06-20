import { Fade, Stack } from '@mui/material';
import { Scaffold } from '../../shared/components/Scaffold';
import { ContinueCard } from './components/ContinueCard';
import { Greeting } from './components/Greeting';
import { LeitnerStatsCard } from './components/LeitnerStatsCard';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';
import { useDashboardData } from './hooks/useDashboardData';

export default function DashboardPage () {
  const { profileName, streak, subscription, currentLesson, motivationalSentence, leitnerTotalItems, leitnerDueItems, isLoading } = useDashboardData();

  if (isLoading) return null;

  return (
    <Scaffold >
      <Stack spacing={2}>
        <Fade in timeout={400}>
          <div><Greeting name={profileName} motivationalSentence={motivationalSentence} /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '150ms' }}>
          <div><ContinueCard lesson={currentLesson} /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
          <div><StreakCardBlaze streak={streak} /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '450ms' }}>
          <div><LeitnerStatsCard totalItems={leitnerTotalItems} dueItems={leitnerDueItems} /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '600ms' }}>
          <div><UserSubscriptionCard subscription={subscription} /></div>
        </Fade>
      </Stack>
    </Scaffold>
  );
}
