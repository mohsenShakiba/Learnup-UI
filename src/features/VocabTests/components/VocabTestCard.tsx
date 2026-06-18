import { Box, Divider, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { AnswerTestResponse, VocabTestsService, VocabTestType } from '../../../api/Learnup';
import type { VocabTestResponse } from '../../../api/Learnup/models/VocabTestResponse';

const typeMessages: Record<VocabTestType, string> = {
  [VocabTestType.FIND_THE_RIGHT_WORD]: 'کلمه مناسب را برای لغت زیر پیدا کنید',
  [VocabTestType.FIND_THE_RIGHT_TRANSLATION]: 'ترجمه درست را برای کلمه زیر پیدا کنید',
  [VocabTestType.FILL_IN_THE_BLANKS]: 'جای خالی را پر کنید',
};

type Props = {
  test: VocabTestResponse;
  onAnswer?: (testId: number, isCorrect: boolean) => void;
};

export function VocabTestCard ({ test, onAnswer }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(
    test.userSelectedOptionId ?? null
  );
  const [result, setResult] = useState<AnswerTestResponse | null>(
    test.userSelectedOptionId != null && test.isCorrect != null
      ? { isCorrect: test.isCorrect, correctOptionId: -1 }
      : null
  );

  const answered = selectedOptionId !== null && result !== null;

  const mutation = useMutation({
    mutationFn: (optionId: number) =>
      VocabTestsService.answerVocabTest(test.id, { selectedOptionId: optionId }),
    onSuccess: (data, optionId) => {
      setSelectedOptionId(optionId);
      setResult(data);
      onAnswer?.(test.id, data.isCorrect);
    },
  });

  function handleSelect (optionId: number) {
    if (answered || mutation.isPending) return;
    mutation.mutate(optionId);
  }

  function getOptionColor (optionId: number): string {
    if (!answered) return 'background.paper';
    if (result.correctOptionId === optionId) return 'success.main';
    if (selectedOptionId === optionId && !result.isCorrect) return 'error.main';
    return 'background.paper';
  }

  function getOptionTextColor (optionId: number): string {
    if (!answered) return 'text.primary';
    if (result.correctOptionId === optionId) return '#fff';
    if (selectedOptionId === optionId && !result.isCorrect) return '#fff';
    return 'text.secondary';
  }

  return (
    <Box sx={{ p: 2, m: 2, height: '100%', boxSizing: 'border-box', overflow: 'auto', }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>

        <Typography variant="caption" sx={{ direction: 'rtl', color: "text.secondary" }}>
          {typeMessages[test.type]}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: '500', direction: 'rtl' }}>
          {test.question}
        </Typography>

        <Divider sx={{ width: '100%' }} />

        {test.options.map((option) => (
          <Box

            key={option.id}
            onClick={() => handleSelect(option.id)}
            sx={{
              width: '100%',
              textAlign: 'center',
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: getOptionColor(option.id),
              cursor: answered ? 'default' : 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s',
              '&:hover': !answered
                ? { borderColor: 'primary.main', bgcolor: 'action.hover' }
                : undefined,
            }}
          >
            <Typography
              variant="body2"
              sx={{ direction: 'rtl', color: getOptionTextColor(option.id) }}
            >
              {option.text}
            </Typography>
          </Box>
        ))}

      </Stack>
    </Box>
  );
}
