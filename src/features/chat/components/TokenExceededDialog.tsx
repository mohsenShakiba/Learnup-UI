import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { useDialogStore } from "../../../shared/dialog/dialogStore";

export function TokenExceededDialog () {
  const closeDialog = useDialogStore((state) => state.close);
  const close = () => closeDialog();

  return (
    <Dialog
      open
      onClose={close}
      slotProps={{ paper: { sx: { borderRadius: 4, m: 2 } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        اعتبار روزانه شما تمام شده!
      </DialogTitle>
      <DialogContent >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          اعتبار گفتگوی هوش مصنوعی شما تمام شده یا برای ادامه کافی نیست.
          برای ادامه باید تا فردا صبر کنید.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
