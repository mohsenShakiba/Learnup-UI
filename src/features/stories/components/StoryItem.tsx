import { Box, Card, Typography } from '@mui/material';
import { useMemo } from 'react';
import type { StoryItemResponse } from '../../../api/Learnup';
import { useStoryAudio } from '../hooks/useStoryAudio';

type StoryItemProps = {
  item: StoryItemResponse;
};

const tokenizeContent = (content: string) => content.split(/(\s+)/);
const isWhitespace = (token: string) => /^\s+$/.test(token);

export function StoryItem ({ item }: StoryItemProps) {

  const { activeItemId, activeTimestampIndex, playbackStatus, showTranslation, playItemAudio } = useStoryAudio();


  const isActive = playbackStatus === 'playing' && activeItemId === item.id;
  const highlightedWordIndex = isActive ? activeTimestampIndex : -1;

  const play = () => {
    if (item.id != null) {
      void playItemAudio(item.id);
    }
  };

  const contentTokens = useMemo(() => {
    const tokens = tokenizeContent(item.content ?? '');

    return tokens.map((token, tokenIndex) => ({
      token,
      tokenIndex,
      wordIndex: isWhitespace(token)
        ? null
        : tokens.slice(0, tokenIndex + 1).filter((currentToken) => !isWhitespace(currentToken)).length - 1,
    }));
  }, [item.content]);

  return (
    <Box
      key={item.id}
      onClick={play}
      role="button"
      tabIndex={0}
    >
      <Card
        sx={(theme) => ({
          border: '1px solid',
          borderColor: isActive ? 'primary.main' : 'divider',
          cursor: 'pointer',
          transition: theme.transitions.create(['border-color'], {
            duration: theme.transitions.duration.short,
          }),
        })}
      >
        <Typography >
          {contentTokens.map(({ token, tokenIndex, wordIndex }) => {
            if (wordIndex == null) {
              return token;
            }

            return (
              <Box
                component="span"
                key={`${token}-${tokenIndex}`}
                sx={(theme) => ({
                  color: wordIndex === highlightedWordIndex ? 'primary.main' : 'inherit',
                  transition: theme.transitions.create(['background-color', 'color'], {
                    duration: theme.transitions.duration.standard,
                  }),
                })}
              >
                {token}
              </Box>
            );
          })}
        </Typography>

        {
          showTranslation && <Typography sx={{ color: 'text.secondary', textAlign: 'right', direction: 'rtl' }}>
            {item.translation}
          </Typography>
        }
      </Card>
    </Box>
  );
}
