import { Box, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { AppIcon } from '../../../shared/components/AppIcon';
import { useStoryAudio } from "../hooks/useStoryAudio";

export function StoryControls () {

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
  } = useStoryAudio();

  const isPlaying = playbackStatus === 'playing';
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);

  const togglePlaybackSpeed = () => {
    const nextIsSlowSpeed = !isSlowSpeed;
    const nextPlaybackRate = nextIsSlowSpeed ? 0.8 : 1;

    setIsSlowSpeed(nextIsSlowSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = nextPlaybackRate;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        borderRadius: 2,
        left: { xs: 24, md: 'auto' },
        right: { xs: 24, md: '50%' },
        width: 'auto',
        px: 3,
        py: 1.5,
        transform: { xs: 'none', md: 'translate(50%)' },
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 0 10px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(20px)'
      }}
    >

      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
      />

      <Stack direction='row' spacing={2} sx={{ justifyContent: { xs: 'space-between', md: 'center' } }} >

        <IconButton
          color={isSlowSpeed ? "primary" : "default"}
          onClick={togglePlaybackSpeed}
          title={isSlowSpeed ? "Normal speed" : "Slow speed"}
          sx={{ width: 30, height: 30, borderRadius: 999 }}>
          <AppIcon sx={{ fontSize: '25px !important' }}>speed</AppIcon>
        </IconButton>

        <IconButton
          onClick={playNextItem}
          sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
          <AppIcon sx={{ fontSize: '25px !important' }}>chevron_right</AppIcon>
        </IconButton>


        {
          isPlaying ?
            <IconButton
              color="warning"
              onClick={pause}
              sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
              <AppIcon sx={{ fontSize: '25px !important' }}>pause</AppIcon>
            </IconButton>
            : <IconButton
              color="primary"
              onClick={play}
              sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
              <AppIcon sx={{ fontSize: '25px !important' }}>play_arrow</AppIcon>
            </IconButton>
        }

        <IconButton
          onClick={playPreviousItem}
          sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
          <AppIcon sx={{ fontSize: '25px !important' }}>chevron_left</AppIcon>
        </IconButton>


        <IconButton
          color={showTranslation ? "primary" : "default"}
          onClick={onToggleTranslation}
          title={showTranslation ? "Hide translation" : "Show translation"}
          sx={{ width: 30, height: 30, borderRadius: 999 }}>
          <AppIcon sx={{ fontSize: '25px !important' }}>
            closed_caption
          </AppIcon>
        </IconButton>

      </Stack>

    </Box>
  );
}
