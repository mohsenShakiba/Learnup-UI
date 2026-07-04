import { Box, SwipeableDrawer } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSwipeableDrawerStore } from "./swipeableDrawerStore";

/** Ignore close attempts fired within this window after the drawer opens. */
const CLOSE_LOCK_MS = 1000;

/**
 * Renders the active global drawer. Mount once near the app root. Drawers are
 * triggered imperatively via `showDrawer`.
 */
export function SwipeableDrawerHost() {
  const drawer = useSwipeableDrawerStore((s) => s.drawer);
  const close = useSwipeableDrawerStore((s) => s.close);

  const openedAtRef = useRef<number | null>(null);

  useEffect(() => {
    openedAtRef.current = drawer != null ? Date.now() : null;
  }, [drawer]);

  const handleClose = () => {
    const openedAt = openedAtRef.current;
    if (openedAt != null && Date.now() - openedAt < CLOSE_LOCK_MS) {
      return;
    }
    close(drawer?.id);
  };

  return (
    <SwipeableDrawer
      anchor={drawer?.anchor ?? "bottom"}
      open={drawer != null}
      onClose={handleClose}
      onOpen={() => undefined}
      disableBackdropTransition={drawer?.disableBackdropTransition}
      disableDiscovery={drawer?.disableDiscovery}
      keepMounted={false}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: drawer?.anchor === "bottom" ? 24 : undefined,
            borderTopRightRadius: drawer?.anchor === "bottom" ? 24 : undefined,
            maxHeight: drawer?.anchor === "bottom" ? "88vh" : undefined,
            ...drawer?.paperSx,
          },
        },
      }}
    >
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', my: 2 }} />

      <Box sx={{ overflowY: "auto" }}>{drawer?.content}</Box>
    </SwipeableDrawer>
  );
}
