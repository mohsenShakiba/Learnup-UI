import { Alert, Snackbar } from "@mui/material";
import { useToastStore } from "./toastStore";

/**
 * Renders active toasts. Mount once near the app root (inside the theme
 * provider). Toasts are triggered imperatively via the `toast` API.
 */
export function ToastHost () {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <>
      {toasts.map((t, index) => (
        <Snackbar
          key={t.id}
          open
          autoHideDuration={t.duration}
          onClose={(_, reason) => {
            if (reason === "clickaway") return;
            dismiss(t.id);
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{ bottom: { xs: 90 + index * 64, sm: 24 + index * 64 } }}
        >
          <Alert
            severity={t.severity}
            variant="filled"
            onClose={() => dismiss(t.id)}
            sx={{ width: "100%" }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
