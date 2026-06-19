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
        <StreakCardBlaze
          streakCount={0}
          weekDates={[14, 15, 16, 17, 18, 19, 20]}
          todayIndex={5}
          weekActivity={[false, false, false, false, true, true, false]}
        />
        <UserSubscriptionCard />
      </Stack>
    </Scaffold>
  );
}
