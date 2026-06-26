import { Avatar, Box, Stack, Typography } from "@mui/material";
import type { StoryItemResponse } from "../../../api/Learnup";
import { useStoryAudio } from "../hooks/useStoryAudio";

type StoryItemProps = {
  item: StoryItemResponse;
};

const AVATAR_SIZE = 30;

export function StoryItem({ item }: StoryItemProps) {
  const { activeItemId, playbackStatus, showTranslation, playItemAudio } =
    useStoryAudio();

  const isActive = playbackStatus === "playing" && activeItemId === item.id;
  const isPerson1 = item.person === 1;

  const play = () => {
    if (item.id != null) {
      void playItemAudio(item.id);
    }
  };

  const words = item.content.split(/(\s+)/);

  const bubble = (
    <Box
      onClick={play}
      role="button"
      tabIndex={0}
      sx={(theme) => ({
        maxWidth: '75%',
        px: 1.5,
        py: 1,
        borderRadius: isPerson1
          ? '16px 16px 16px 2px'
          : '16px 16px 2px 16px',
        bgcolor: isPerson1 ? 'primary.main' : 'background.paper',
        border: '1px solid',
        borderColor: isActive ? 'secondary.main' : isPerson1 ? 'primary.dark' : 'divider',
        cursor: 'pointer',
        transition: theme.transitions.create(['border-color'], {
          duration: theme.transitions.duration.short,
        }),
      })}
    >
      <Typography
        sx={{
          direction: 'rtl',
          color: isPerson1 ? 'primary.contrastText' : 'text.primary',
          m: 0,
        }}
      >
        {words.map((word, index) =>
          /\s+/.test(word) ? (
            word
          ) : (
            <Box
              key={`${item.id}-${index}`}
              component="span"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            >
              {word}
            </Box>
          ),
        )}
      </Typography>
      {showTranslation && (
        <Typography
          variant="body2"
          sx={{
            color: isPerson1 ? 'primary.contrastText' : 'text.secondary',
            opacity: 0.8,
            direction: 'ltr',
            mt: 0.5,
            mb: 0,
          }}
        >
          {item.translation}
        </Typography>
      )}
    </Box>
  );

  const avatar = (
    <Avatar
      sx={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        fontSize: 12,
        bgcolor: isPerson1 ? 'primary.dark' : 'secondary.main',
        flexShrink: 0,
      }}
    >
      {isPerson1 ? 'P1' : 'P2'}
    </Avatar>
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ justifyContent: isPerson1 ? 'flex-start' : 'flex-end', alignItems: 'flex-end' }}
    >
      {isPerson1 ? (
        <>
          {avatar}
          {bubble}
        </>
      ) : (
        <>
          {bubble}
          {avatar}
        </>
      )}
    </Stack>
  );
}
