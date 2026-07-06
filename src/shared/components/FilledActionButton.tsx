import { IconButton, type IconButtonProps } from "@mui/material";
import { AppIcon, type IconName } from "./AppIcon";

type FilledActionButtonProps = Omit<IconButtonProps, "children"> & {
  icon: IconName;
};

export function FilledActionButton ({
  icon,
  sx,
  ...props
}: FilledActionButtonProps) {
  return (
    <IconButton
      {...props}
      sx={[
        {
          height: 40,
          width: 40,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          "&.Mui-disabled": {
            bgcolor: "action.disabledBackground",
            color: "action.disabled",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AppIcon>{icon}</AppIcon>
    </IconButton>
  );
}
