import {
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack
} from "@mui/material";
import { useState } from "react";
import {
  AnswerQuality,
  type DueLeitnerBoxItemResponse
} from "../../../api/Learnup";
import { AppIcon } from "../../../shared/components/AppIcon";
import { VocabListItem } from "../../vocabs/components/VocabListItem";

type ReviewAnswerPanelProps = {
  card: DueLeitnerBoxItemResponse;
  disabled: boolean;
  onMainAction: () => void;
  onQualitySelect: (quality: AnswerQuality) => void;
  onRemove: () => void;
};

export function ReviewAnswerPanel ({
  card,
  disabled,
  onMainAction,
  onQualitySelect,
  onRemove,
}: ReviewAnswerPanelProps) {

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  function handleMenuSelect (action: () => void) {
    setMenuAnchor(null);
    action();
  }

  return (
    <Stack spacing={1.5} sx={{ px: 2, pb: 3 }}>

      <VocabListItem vocab={{ ...card, isInLeitnerBox: true, level: 1 }} showBookmark={false} />

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={onMainAction}
          sx={{
            flex: 1,
            borderRadius: 1,
          }}
        >
          انتقال به سطح بعد
        </Button>

        <IconButton
          aria-label="گزینه‌های بیشتر"
          disabled={disabled}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <AppIcon>more_vert</AppIcon>
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          slotProps={{
            list: { dense: true },
          }}
        >
          <MenuItem
            onClick={() =>
              handleMenuSelect(() => onQualitySelect(AnswerQuality.NO_IDEA))
            }
          >
            <ListItemText>دوباره</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() =>
              handleMenuSelect(() => onQualitySelect(AnswerQuality.HARD))
            }
          >
            <ListItemText>سخت</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() =>
              handleMenuSelect(() =>
                onQualitySelect(AnswerQuality.PEACE_OF_CAKE),
              )
            }
          >
            <ListItemText>خیلی ساده</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => handleMenuSelect(onRemove)}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AppIcon sx={{ color: "error.main", fontSize: 20 }}>
                delete
              </AppIcon>
            </ListItemIcon>
            <ListItemText sx={{ color: "error.main" }}>
              حذف از جعبه
            </ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}
