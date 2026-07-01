import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { PlacementSkill } from '../../../api/Learnup';
import type { PlacementQuestionResponse } from '../../../api/Learnup/models/PlacementQuestionResponse';

type Props = {
  question: PlacementQuestionResponse;
  selectedOptionId: number | null;
  onSelect: (optionId: number) => void;
};

const SKILL_LABELS: Record<PlacementSkill, string> = {
  [PlacementSkill.GRAMMAR]: 'Grammar',
  [PlacementSkill.VOCABULARY]: 'Vocabulary',
};

export function PlacementQuestionCard ({ question, selectedOptionId, onSelect }: Props) {
  return (
    <Box sx={{ p: 2, m: 2, height: '100%', boxSizing: 'border-box', direction: 'rtl', overflow: 'auto' }}>
      <Stack spacing={2} sx={{ alignItems: 'start' }}>

        {SKILL_LABELS[question.skill] && (
          <Chip label={SKILL_LABELS[question.skill]} size="small" sx={{ fontFamily: 'arial' }} />
        )}

        {/* English prompt rendered LTR */}
        <Typography variant="body1" sx={{ fontWeight: 500, direction: 'rtl', width: '100%' }}>
          {question.prompt}
        </Typography>

        <Divider sx={{ width: '100%' }} />

        {question.options.map((option) => {
          const selected = selectedOptionId === option.id;
          return (
            <Box
              key={option.id}
              onClick={() => onSelect(option.id)}
              sx={{
                width: '100%',
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected ? 'primary.main' : 'background.paper',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s',
                '&:hover': !selected
                  ? { borderColor: 'primary.main', bgcolor: 'action.hover' }
                  : undefined,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: selected ? 'primary.contrastText' : 'text.primary', direction: 'rtl', }}
              >
                {option.text}
              </Typography>
            </Box>
          );
        })}

      </Stack>
    </Box>
  );
}
