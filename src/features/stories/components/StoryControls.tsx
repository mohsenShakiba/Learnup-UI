import { Box, Icon, IconButton, LinearProgress, Stack } from "@mui/material";
import type { StoryResponse } from "../../../api/Learnup";
import { useStoryAudio } from "../hooks/useStoryAudio";

export function StoryControls (props: { story: StoryResponse; }) {

  const {
    audioRef,
    playbackStatus,
    progressPercentage,
    play,
    pause,
    restart,
    handleAudioEnded,
    handleLoadedMetadata,
    handlePause,
    handleTimeUpdate,
  } = useStoryAudio(props.story.items ?? []);

  const isPlaying = playbackStatus === 'playing';

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        left: 12,
        maxWidth: 600,
        margin: '0 auto',
        padding: 2,
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
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

      <Stack direction='row'>

        {
          !isPlaying && <>
            <IconButton
              color="primary"
              onClick={play}
              sx={{ width: 50, height: 50, borderRadius: 999 }}>
              <Icon sx={{ fontSize: '35px !important' }}>play_circle</Icon>
            </IconButton>
          </>
        }

        {
          isPlaying && <>
            <IconButton
              color="warning"
              onClick={pause}
              sx={{ width: 50, height: 50, borderRadius: 999 }}>
              <Icon sx={{ fontSize: '35px !important' }}>pause_circle</Icon>
            </IconButton>
          </>
        }

        <IconButton
          color="secondary"
          onClick={restart}
          sx={{ width: 50, height: 50, borderRadius: 999 }}>
          <Icon sx={{ fontSize: '35px !important' }}>replay</Icon>
        </IconButton>

      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressPercentage} />
    </Box>
  );
}
