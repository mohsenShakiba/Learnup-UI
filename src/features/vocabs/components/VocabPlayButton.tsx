import { CircularProgress, Icon, IconButton } from "@mui/material";
import { useState } from "react";
import { playAudio } from "../../../services/audioService";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

type Props = {
  voiceId: string;
};

export function VocabPlayButton ({ voiceId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      await playAudio(`${apiBaseUrl}/Mobile/Files/${voiceId}`);
    } catch (err) {
      console.error("Failed to play vocab voice:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IconButton
      onClick={() => void handlePlay()}
      disabled={isLoading}
      sx={{
        flexShrink: 0,
        alignSelf: "center",
        width: 44,
        height: 44,
        p: 0,
        marginRight: "auto",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "grey.50",
        color: "primary.main",
        "&:hover": {
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderColor: "primary.main",
        },
      }}
    >
      {isLoading ? <CircularProgress size={20} /> : <Icon>volume_up</Icon>}
    </IconButton>
  );
}
