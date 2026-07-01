import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { DotGrid } from "./DotGrid";

type ScaffoldProps = {
  header?: ReactNode;
  children: ReactNode;
  disablePadding?: boolean;
  disableBottomPadding?: boolean;
  maxWidth?: string | number;
};

export function Scaffold({
  header,
  children,
  disablePadding,
  disableBottomPadding,
  maxWidth = "500px",
}: ScaffoldProps) {
  return (
    <Box
      sx={{
        p: 0,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {header && <>{header}</>}
      <DotGrid />
      <Box
        component="main"
        sx={{
          maxWidth,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflowY: "auto",
          mx: "auto",
          py: disablePadding ? 0 : 2,
          px: disablePadding ? 0 : 2,
          boxSizing: "border-box",
          pb: disableBottomPadding ? 0 : 9,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
