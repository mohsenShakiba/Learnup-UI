import { Icon } from '../../../shared/components/Icon';
import { CircularProgress, IconButton } from "@mui/material";
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
    <IconButton size="small" onClick={handlePlay}>
      {isLoading ? <CircularProgress size={20} /> : <Icon>volume_up</Icon>}
    </IconButton>
  );
}
