import { Box, IconButton, Stack, useTheme } from "@mui/material";
import { useState } from "react";
import { AppIcon } from '../../../shared/components/AppIcon';
import { toast } from "../../../shared/toast";
import { useConversationAudio } from "../hooks/useConversationAudio";

export function ConversationControls () {

  const {
    audioRef,
    playbackStatus,
    play,
    pause,
    playNextItem,
    playPreviousItem,
    handleAudioEnded,
    handleLoadedMetadata,
    handlePause,
    handleTimeUpdate,
    showTranslation,
    onToggleTranslation,
  } = useConversationAudio();

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isPlaying = playbackStatus === 'playing';
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);

  const togglePlaybackSpeed = () => {
    const nextIsSlowSpeed = !isSlowSpeed;
    const nextPlaybackRate = nextIsSlowSpeed ? 0.8 : 1;

    setIsSlowSpeed(nextIsSlowSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = nextPlaybackRate;
    }

    toast.info(nextIsSlowSpeed ? "سرعت پخش کند شد" : "سرعت پخش عادی شد");
  };

  const handleToggleTranslation = () => {
    onToggleTranslation();
    toast.info(showTranslation ? "ترجمه مخفی شد" : "ترجمه نمایش داده شد");
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        borderRadius: '24px',
        left: 24,
        right: 24,
        width: 'auto',
        px: 2,
        py: 0.5,
        backgroundColor: isDark ? 'rgba(40,38,46,0.55)' : 'rgba(255,255,255,0.5)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.45)'
          : '0 8px 32px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(10px)'
      }}
    >

      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
      />

      <Stack direction='row' sx={{ justifyContent: { xs: 'space-between', md: 'center' } }} >

        <IconButton
          color={isSlowSpeed ? "primary" : "default"}
          onClick={togglePlaybackSpeed}
          title={isSlowSpeed ? "Normal speed" : "Slow speed"}>
          <AppIcon>speed</AppIcon>
        </IconButton>

        <IconButton
          onClick={playNextItem}  >
          <AppIcon sx={{ fontSize: 35 }} >arrow_circle_right</AppIcon>
        </IconButton>


        {
          isPlaying ?
            <IconButton
              color="warning"
              onClick={pause}>
              <AppIcon sx={{ fontSize: '35px !important' }}>pause_circle</AppIcon>
            </IconButton>
            : <IconButton
              color="primary"
              onClick={play}>
              <AppIcon sx={{ fontSize: '35px !important' }}>play_circle</AppIcon>
            </IconButton>
        }

        <IconButton
          onClick={playPreviousItem}
        >
          <AppIcon sx={{ fontSize: 35 }}>arrow_circle_left</AppIcon>
        </IconButton>


        <IconButton
          color={showTranslation ? "primary" : "default"}
          onClick={handleToggleTranslation}
          title={showTranslation ? "Hide translation" : "Show translation"}>
          <AppIcon>
            closed_caption
          </AppIcon>
        </IconButton>

      </Stack>

    </Box>
  );
}
