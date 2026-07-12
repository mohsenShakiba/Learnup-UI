import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDialogStore } from "../../../shared/dialog/dialogStore";

export function AccessLimitDialog () {
  const navigate = useNavigate();
  const closeDialog = useDialogStore((state) => state.close);

  const close = () => {
    closeDialog();
    navigate(-1);
  };

  const goToSubscriptions = () => {
    closeDialog();
    navigate("/settings/subscriptions");
  };

  return (
    <Dialog
      open
      onClose={close}
      slotProps={{ paper: { sx: { borderRadius: 4, m: 2 } } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        لطفا برای ادامه مشاهده دروس اشتراک تهیه کنید.
      </DialogTitle>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={close} color="inherit">
          بعداً
        </Button>
        <Button variant="contained" onClick={goToSubscriptions}>
          خرید اشتراک
        </Button>
      </DialogActions>
    </Dialog>
  );
}
