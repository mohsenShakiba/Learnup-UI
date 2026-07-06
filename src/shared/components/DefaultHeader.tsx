import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UsersService } from "../../api/Learnup";
import { SettingsDrawer } from "../../features/settings/SettingsDrawer";
import { getFileById } from "../../services/fetchFile";
import { AppIcon } from "./AppIcon";
import { ROOT_TABS } from "./BottomNav";

type DefaultHeaderProps = {
  header: string;
  children?: ReactNode;
};

export function DefaultHeader ({
  header,
  children,
}: DefaultHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootTab = ROOT_TABS.some((tab) => tab.path === location.pathname);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => UsersService.getProfile(),
    enabled: isRootTab,
  });
  const profile = profileQuery.data;

  useEffect(() => {
    if (!profile?.avatarUrl) {
      setAvatarUrl(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    getFileById(profile.avatarUrl)
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer]));
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setAvatarUrl(url);
      })
      .catch(() => {
        if (!cancelled) setAvatarUrl(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [profile?.avatarUrl]);

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        flexShrink: 0,
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 1,
        px: 2,
        height: 60,
      }}
    >
      <Grid container sx={{ width: "100%", alignItems: "center" }}>
        <Grid size={2} sx={{ display: "flex", justifyContent: "flex-start" }}>
          {!isRootTab ? (
            <IconButton onClick={() => navigate(-1)}>
              <AppIcon>arrow_forward</AppIcon>
            </IconButton>
          ) : (
            <IconButton onClick={() => setSettingsOpen(true)}>
              <AppIcon>menu</AppIcon>
            </IconButton>
          )}
        </Grid>

        <Grid size={8} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="body1">{header}</Typography>
        </Grid>

        <Grid size={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          {isRootTab && !children && (
            <Avatar
              src={avatarUrl ?? undefined}
              sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
            >
              {!avatarUrl &&
                (profile?.displayName?.[0]?.toUpperCase() ?? undefined)}
            </Avatar>
          )}
          {children}
        </Grid>
      </Grid>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Box>
  );
}
