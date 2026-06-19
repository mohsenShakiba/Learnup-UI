import { Stack } from '@mui/material';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';

export default function DashboardPage () {
  return (
    <Scaffold header={<DefaultHeader header="Dashboard" />}>
      <Stack spacing={2}>
        {/* <StreakCard /> */}
        <StreakCardBlaze streakCount={2} />
        <UserSubscriptionCard />
      </Stack>
    </Scaffold>
  );
}
