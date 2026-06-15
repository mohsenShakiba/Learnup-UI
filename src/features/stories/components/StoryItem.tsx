import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import type { StoryItemResponse } from "../../../api/Learnup";
import { VocabSwipeableDrawer } from "../../vocabs/components/VocabSwipeableDrawer";
import { useStoryAudio } from "../hooks/useStoryAudio";

type StoryItemProps = {
  item: StoryItemResponse;
};

export function StoryItem({ item }: StoryItemProps) {
  const { activeItemId, playbackStatus, showTranslation, playItemAudio } =
    useStoryAudio();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const isActive = playbackStatus === "playing" && activeItemId === item.id;

  const play = () => {
    if (item.id != null) {
      void playItemAudio(item.id);
    }
  };

  const words = item.content.split(/(\s+)/);

  return (
    <>
      <Box key={item.id} onClick={play} role="button" tabIndex={0}>
        <Card
          sx={(theme) => ({
            border: "1px solid",
            borderColor: isActive ? "primary.main" : "divider",
            cursor: "pointer",
            transition: theme.transitions.create(["border-color", "opacity"], {
              duration: theme.transitions.duration.short,
            }),
          })}
        >
          <Typography sx={{ direction: "rtl" }}>
            {words.map((word, index) =>
              /\s+/.test(word) ? (
                word
              ) : (
                <Box
                  key={`${item.id}-${index}`}
                  component="span"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedWord(word);
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
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
              sx={{ color: "text.secondary", direction: "ltr" }}
            >
              {item.translation}
            </Typography>
          )}
        </Card>
      </Box>

      <VocabSwipeableDrawer
        open={selectedWord != null}
        selectedWord={selectedWord}
        onClose={() => setSelectedWord(null)}
        hideTriggerList
        vocabs={selectedWord ? [{ id: 0, word: selectedWord }] : []}
      />
    </>
  );
}
