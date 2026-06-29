import { Box, SwipeableDrawer } from "@mui/material";
import { useSwipeableDrawerStore } from "./swipeableDrawerStore";

/**
 * Renders the active global drawer. Mount once near the app root. Drawers are
 * triggered imperatively via `showDrawer`.
 */
export function SwipeableDrawerHost () {
  const drawer = useSwipeableDrawerStore((s) => s.drawer);
  const close = useSwipeableDrawerStore((s) => s.close);

  return (
    <SwipeableDrawer
      anchor={drawer?.anchor ?? "bottom"}
      open={drawer != null}
      onClose={() => close(drawer?.id)}
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
