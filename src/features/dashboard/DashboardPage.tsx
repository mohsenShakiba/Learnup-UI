import { Fade, Stack } from '@mui/material';
import { Scaffold } from '../../shared/components/Scaffold';
import { ContinueCard } from './components/ContinueCard';
import { Greeting } from './components/Greeting';
import { LeitnerStatsCard } from './components/LeitnerStatsCard';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';
import { useDashboardData } from './hooks/useDashboardData';

export default function DashboardPage() {
  const { profileName, streak, subscription, currentLesson, motivationalSentence, leitnerTotalItems, leitnerDueItems, isLoading } = useDashboardData();

  if (isLoading) return null;

  return (
    <Scaffold >
      <Stack spacing={2}>
        <Fade in timeout={500}>
          <div><Greeting name={profileName} motivationalSentence={motivationalSentence} /></div>
        </Fade>
        {currentLesson && (
          <Fade in timeout={500} style={{ transitionDelay: '200ms' }}>
            <div><ContinueCard lesson={currentLesson} /></div>
          </Fade>
        )}
        <Fade in timeout={500} style={{ transitionDelay: '300ms' }}>
          <div><StreakCardBlaze streak={streak} /></div>
        </Fade>
        <Fade in timeout={500} style={{ transitionDelay: '400ms' }}>
          <div><LeitnerStatsCard totalItems={leitnerTotalItems} dueItems={leitnerDueItems} /></div>
        </Fade>
        <Fade in timeout={500} style={{ transitionDelay: '500ms' }}>
          <div><UserSubscriptionCard subscription={subscription} /></div>
        </Fade>
      </Stack>
    </Scaffold>
  );
}
