import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChatsService } from "../../../api/Learnup";
import { AppIcon } from "../../../shared/components/AppIcon";
import { AppLoader } from "../../../shared/components/AppLoader";

type ConversationListDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Id of the conversation currently shown, to highlight it in the list. */
  currentConversationId?: number;
};

function formatDate (value: string): string {
  return new Date(value).toLocaleDateString("fa-IR");
}

export function ConversationListDrawer ({
  open,
  onClose,
  currentConversationId,
}: ConversationListDrawerProps) {
  const navigate = useNavigate();

  const conversationsQuery = useQuery({
    queryKey: ["chats"],
    queryFn: () => ChatsService.listChats(),
    enabled: open,
    // Reflect newly started threads each time the list is opened.
    staleTime: 0,
  });
  const conversations = conversationsQuery.data ?? [];

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={() => undefined}
      disableBackdropTransition
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: 320, sm: 360 },
          maxWidth: "calc(100vw - 40px)",
          height: "100dvh",
          px: 2,
          py: 2,
          bgcolor: "background.default",
          borderRadius: 0,
        },
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Typography variant="subtitle1" sx={{ px: 1, mb: 1 }}>
          گفتگوها
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AppIcon>add</AppIcon>}
          onClick={() => go("/chat")}
          sx={{ mb: 1 }}
        >
          گفتگوی جدید
        </Button>

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {conversationsQuery.isLoading ? (
            <AppLoader />
          ) : conversations.length === 0 ? (
            <Stack
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              <AppIcon sx={{ fontSize: 40, opacity: 0.3 }}>forum</AppIcon>
              <Typography variant="caption">هنوز گفتگویی نداری</Typography>
            </Stack>
          ) : (
            <List dense sx={{ direction: "rtl" }}>
              {conversations.map((conversation) => (
                <ListItemButton
                  key={conversation.id}
                  selected={conversation.id === currentConversationId}
                  onClick={() => go(`/chat/${conversation.id}`)}
                  sx={{ borderRadius: 1.5, mb: 0.5 }}
                >
                  <ListItemText
                    primary={conversation.title ?? "گفتگوی بدون عنوان"}
                    secondary={formatDate(conversation.updatedAt)}
                    slotProps={{
                      primary: { noWrap: true },
                      secondary: { variant: "caption" },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Stack>
    </SwipeableDrawer>
  );
}
