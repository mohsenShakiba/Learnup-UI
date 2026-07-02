import { Fade, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { ContinueCard } from './components/ContinueCard';
import { Greeting } from './components/Greeting';
import { LeitnerStatsCard } from './components/LeitnerStatsCard';
import { PlacementCard } from './components/PlacementCard';
import { StreakCardBlaze } from './components/StreakCardBlaze';
import { UserSubscriptionCard } from './components/UserSubscriptionCard';
import { useDashboardData } from './hooks/useDashboardData';

let hasDashboardItemsFadedIn = false;

export default function DashboardPage () {
  const { profileName, streak, subscription, currentLesson, motivationalSentence, leitnerTotalItems, leitnerDueItems, placementLevel, isLoading } = useDashboardData();
  const [shouldFadeIn] = useState(() => !hasDashboardItemsFadedIn);

  useEffect(() => {
    if (!isLoading && shouldFadeIn) hasDashboardItemsFadedIn = true;
  }, [isLoading, shouldFadeIn]);


  return (
    <Scaffold header={<DefaultHeader header="داشبورد" />}>
      {
        isLoading && <AppLoader />
      }

      {
        !isLoading && (
          <Stack spacing={2}>
            <Fade in timeout={shouldFadeIn ? 500 : 0}>
              <div><Greeting name={profileName} motivationalSentence={motivationalSentence} /></div>
            </Fade>
            {currentLesson && (
              <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '200ms' : undefined }}>
                <div><ContinueCard lesson={currentLesson} /></div>
              </Fade>
            )}
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '300ms' : undefined }}>
              <div><StreakCardBlaze streak={streak} /></div>
            </Fade>
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '400ms' : undefined }}>
              <div><LeitnerStatsCard totalItems={leitnerTotalItems} dueItems={leitnerDueItems} /></div>
            </Fade>
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '500ms' : undefined }}>
              <div><PlacementCard placementLevel={placementLevel} /></div>
            </Fade>
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '600ms' : undefined }}>
              <div><UserSubscriptionCard subscription={subscription} /></div>
            </Fade>
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '600ms' : undefined }}>
              <div><UserSubscriptionCard subscription={subscription} /></div>
            </Fade>
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '600ms' : undefined }}>
              <div><UserSubscriptionCard subscription={subscription} /></div>
            </Fade>
            <Fade in timeout={shouldFadeIn ? 500 : 0} style={{ transitionDelay: shouldFadeIn ? '600ms' : undefined }}>
              <div><UserSubscriptionCard subscription={subscription} /></div>
            </Fade>
          </Stack>
        )
      }
    </Scaffold>
  );
}
