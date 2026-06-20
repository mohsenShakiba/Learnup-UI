import { useQuery } from '@tanstack/react-query';
import { CoursesService, LessonsService, SubscriptionsService, UsersService } from '../../../api/Learnup';


export function useDashboardData () {
  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => UsersService.getProfile(),
    retry: false,
  });

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

  const coursesQuery = useQuery({
    queryKey: ['courses', 'language', 1],
    queryFn: () => CoursesService.getCoursesByLanguageId(1),
    retry: false,
  });

  const firstCourseId = coursesQuery.data?.[0]?.id;

  const lessonsQuery = useQuery({
    queryKey: ['lessons', 'course', firstCourseId],
    queryFn: () => LessonsService.getLessonsByCourseId(firstCourseId!),
    enabled: firstCourseId != null,
    retry: false,
  });

  const motivationalSentenceQuery = useQuery({
    queryKey: ['user', 'motivational-sentence'],
    queryFn: () => UsersService.getMotivationalSentence(),
    retry: false,
  });

  const lessons = lessonsQuery.data ?? [];
  const currentLesson = lessons.find(l => !l.isCompleted) ?? lessons[lessons.length - 1];


  return {
    profileName: profileQuery.data?.displayName,
    streak: streakQuery.data,
    subscription: subscriptionQuery.data,
    currentLesson,
    motivationalSentence: motivationalSentenceQuery.data?.sentence,
    isLoading: streakQuery.isLoading || subscriptionQuery.isLoading || coursesQuery.isLoading || lessonsQuery.isLoading,
    isError: streakQuery.isError || subscriptionQuery.isError,
  };
}
