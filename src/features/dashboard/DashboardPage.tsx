import { Fade, Stack } from '@mui/material';
import { Scaffold } from '../../shared/components/Scaffold';
import { ContinueCard } from './components/ContinueCard';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';

export default function DashboardPage () {
  return (
    <Scaffold >
      <Stack spacing={2}>
        <Fade in timeout={600}>
          <div><ContinueCard /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
          <div><StreakCardBlaze /></div>
        </Fade>
        <Fade in timeout={600} style={{ transitionDelay: '600ms' }}>
          <div><UserSubscriptionCard /></div>
        </Fade>
      </Stack>
    </Scaffold>
  );
}
