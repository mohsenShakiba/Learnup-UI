import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  AnswerQuality,
  type DueLeitnerBoxItemResponse,
  LeitnerBoxService,
} from "../../../api/Learnup";

type ReviewLeitnerBoxItemVariables = {
  itemId: number;
  answerQuality: AnswerQuality;
};

type RemoveVocabFromLeitnerBoxVariables = {
  itemId: number;
  vocabId: number;
};

function getDueCardsQueryKey (boxLevelId: number) {
  return ["leitner-box-level-due-cards", boxLevelId] as const;
}

const boxLevelsQueryKey = ["leitner-box-levels"] as const;

export function useBoxLevelReview (boxLevelId: number) {
  const queryClient = useQueryClient();
  const dueCardsQueryKey = getDueCardsQueryKey(boxLevelId);

  const dueCardsQuery = useQuery({
    queryKey: dueCardsQueryKey,
    queryFn: () => LeitnerBoxService.getDueWordsByBoxLevelId(boxLevelId),
    enabled: Number.isFinite(boxLevelId) && boxLevelId > 0,
  });

  const boxLevelsQuery = useQuery({
    queryKey: boxLevelsQueryKey,
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
  });

  const cards = dueCardsQuery.data ?? [];
  const levelInfo = useMemo(() => {
    return (boxLevelsQuery.data?.levels ?? []).find(
      (item) => item.id === boxLevelId,
    );
  }, [boxLevelId, boxLevelsQuery.data?.levels]);
  const levelNumber = levelInfo ? Number(levelInfo.level) : null;

  function removeCardFromCache (itemId: number) {
    queryClient.setQueryData<DueLeitnerBoxItemResponse[]>(
      dueCardsQueryKey,
      (previous) => previous?.filter((card) => card.id !== itemId) ?? previous,
    );
  }

  async function invalidateBoxReviewQueries () {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: boxLevelsQueryKey }),
      queryClient.invalidateQueries({ queryKey: dueCardsQueryKey }),
    ]);
  }

  function refetch () {
    void dueCardsQuery.refetch();
    void boxLevelsQuery.refetch();
  }

  const reviewMutation = useMutation({
    mutationFn: ({ itemId, answerQuality }: ReviewLeitnerBoxItemVariables) =>
      LeitnerBoxService.reviewLeitnerBoxItem(itemId, {
        answerQuality,
      }),
    onSuccess: async (_data, variables) => {
      removeCardFromCache(variables.itemId);
      await invalidateBoxReviewQueries();
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ vocabId }: RemoveVocabFromLeitnerBoxVariables) =>
      LeitnerBoxService.removeVocabFromLeitnerBox(vocabId),
    onSuccess: async (_data, variables) => {
      removeCardFromCache(variables.itemId);
      await invalidateBoxReviewQueries();
    },
  });

  return {
    cards,
    levelNumber,
    isLoading: dueCardsQuery.isLoading || boxLevelsQuery.isLoading,
    isError:
      dueCardsQuery.isError || boxLevelsQuery.isError || !boxLevelsQuery.data,
    isActionPending: reviewMutation.isPending || removeMutation.isPending,
    refetch,
    dueCardsQuery,
    boxLevelsQuery,
    reviewMutation,
    removeMutation,
  };
}
