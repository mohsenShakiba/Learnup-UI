import { Stack } from '@mui/material';
import { Scaffold } from '../../shared/components/Scaffold';
import { ContinueCard } from './components/ContinueCard';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';

export default function DashboardPage () {
  return (
    <Scaffold >
      <Stack spacing={2}>
        <ContinueCard />
        <StreakCardBlaze />
        <UserSubscriptionCard />
      </Stack>
    </Scaffold>
  );
}
