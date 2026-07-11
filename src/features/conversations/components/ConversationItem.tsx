import { alpha, Avatar, Box, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type { ConversationItemResponse } from "../../../api/Learnup";
import { showDrawer } from "../../../shared/swipeableDrawer";
import { useConversationAudio } from "../hooks/useConversationAudio";
import { ConversationWordDrawer } from "./ConversationWordDrawer";

type ConversationItemProps = {
  conversationId: number;
  item: ConversationItemResponse;
};

const AVATAR_SIZE = 30;
const LONG_PRESS_DURATION = 500;

export function ConversationItem ({ conversationId, item }: ConversationItemProps) {
  const { activeItemId, playbackStatus, showTranslation, playItemAudio } =
    useConversationAudio();

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isPlaying = playbackStatus === "playing";
  const isActive = isPlaying && activeItemId === item.id;
  const isPerson1 = item.person === 1;

  useEffect(() => {
    if (isActive) {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive]);

  const play = () => {
    // Swallow the tap that follows a long-press so it doesn't also start audio.
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    if (item.id != null) {
      void playItemAudio(item.id);
    }
  };

  const cancelLongPress = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startLongPress = (word: string) => {
    const cleanWord = word.replace(/[^\p{L}\p{N}'-]/gu, "");
    if (!cleanWord) return;

    cancelLongPress();
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      didLongPress.current = true;
      showDrawer(
        <ConversationWordDrawer conversationId={conversationId} itemId={item.id} word={cleanWord} />,
      );
    }, LONG_PRESS_DURATION);
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
        bgcolor: alpha(isPerson1 ? theme.palette.primary.main : theme.palette.secondary.main, 0.05),
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
      })}
    >
      <Typography
        sx={{
          direction: 'rtl',
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
              onPointerDown={() => startLongPress(word)}
              onPointerUp={cancelLongPress}
              onPointerLeave={cancelLongPress}
              onPointerCancel={cancelLongPress}
              sx={{
                cursor: 'pointer',
                userSelect: 'none',
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
      ref={containerRef}
      direction="row"
      spacing={1}
      sx={(theme) => ({
        justifyContent: isPerson1 ? 'flex-start' : 'flex-end',
        alignItems: 'flex-end',
        opacity: isPlaying && !isActive ? 0.5 : 1,
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.short,
        }),
      })}
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
