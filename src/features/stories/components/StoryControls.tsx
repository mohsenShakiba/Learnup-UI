import { Box, Icon, IconButton, Stack } from "@mui/material";
import { useState } from "react";
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
    const nextPlaybackRate = nextIsSlowSpeed ? 0.75 : 1;

    setIsSlowSpeed(nextIsSlowSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = nextPlaybackRate;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: '50%' },
        width: 'auto',
        px: 4,
        py: 2,
        transform: { xs: 'none', md: 'translate(50%)' },
        background: 'rgba(0,0,0,0.2)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
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
          <Icon sx={{ fontSize: '25px !important' }}>speed</Icon>
        </IconButton>

        <IconButton
          onClick={playPreviousItem}
          sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
          <Icon sx={{ fontSize: '25px !important' }}>chevron_left</Icon>
        </IconButton>

        {
          isPlaying ?
            <IconButton
              color="warning"
              onClick={pause}
              sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
              <Icon sx={{ fontSize: '25px !important' }}>pause</Icon>
            </IconButton>
            : <IconButton
              color="primary"
              onClick={play}
              sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
              <Icon sx={{ fontSize: '25px !important' }}>play_arrow</Icon>
            </IconButton>
        }

        <IconButton
          onClick={playNextItem}
          sx={{ width: 30, height: 30, borderRadius: 999, border: '1px solid', borderColor: ' divider' }}>
          <Icon sx={{ fontSize: '25px !important' }}>chevron_right</Icon>
        </IconButton>

        <IconButton
          color={showTranslation ? "primary" : "default"}
          onClick={onToggleTranslation}
          title={showTranslation ? "Hide translation" : "Show translation"}
          sx={{ width: 30, height: 30, borderRadius: 999 }}>
          <Icon sx={{ fontSize: '25px !important' }}>
            closed_caption
          </Icon>
        </IconButton>

      </Stack>

    </Box>
  );
}
