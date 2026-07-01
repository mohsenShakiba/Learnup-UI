import { useQuery } from '@tanstack/react-query';
import { PlacementService } from '../../../api/Learnup';

/**
 * Loads the fixed placement test. The backend owns scoring; the client only
 * renders questions and collects answers.
 */
export function usePlacementTest() {
  return useQuery({
    queryKey: ['placement', 'test'],
    queryFn: () => PlacementService.getPlacementTest(),
  });
}

/**
 * Loads a prior placement result if one exists. A learner who has already taken
 * the test lands directly on the result screen. `retry: false` keeps the 404/empty
 * "not taken yet" case fast, and the caller treats an error as "no result".
 */
export function usePlacementResult() {
  return useQuery({
    queryKey: ['placement', 'result'],
    queryFn: () => PlacementService.getPlacementResult(),
    retry: false,
  });
}
