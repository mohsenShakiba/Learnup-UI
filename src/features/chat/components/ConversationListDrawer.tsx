import {
  Box,
  Button,
  Divider,
  LinearProgress,
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
  currentConversationId?: number;
};

function formatDate (value: string): string {
  return new Date(value).toLocaleDateString("fa-IR");
}

const numberFormatter = new Intl.NumberFormat("fa-IR");

function formatNumber (value: number): string {
  return numberFormatter.format(value);
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

  const tokenUsageQuery = useQuery({
    queryKey: ["chat-token-usage"],
    queryFn: () => ChatsService.getAvailableTokenUsage(),
    enabled: open,
    staleTime: 0,
  });

  const conversations = conversationsQuery.data ?? [];
  const tokenUsage = tokenUsageQuery.data;
  const usageLimit = tokenUsage?.usageLimit ?? 0;
  const currentUsage = tokenUsage?.currentUsage ?? 0;
  const usagePercent = usageLimit > 0
    ? Math.min((currentUsage / usageLimit) * 100, 100)
    : 0;
  const remainingUsage = Math.max(usageLimit - currentUsage, 0);

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
        <Stack direction='row' sx={{ alignItems: 'end', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ px: 1, mb: 1 }}>
            گفتگوها
          </Typography>

          <Button
            size="small"
            variant="outlined"
            startIcon={<AppIcon>add</AppIcon>}
            onClick={() => go("/chat")}
            sx={{ mb: 1 }}
          >
            گفتگوی جدید
          </Button>
        </Stack>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            p: 1.25,
            mb: 1,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
            <Typography variant="caption">
              مصرف توکن شما
            </Typography>
            <Box sx={{ flex: 1 }} />
            {tokenUsageQuery.isFetching && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                در حال دریافت...
              </Typography>
            )}
          </Stack>

          {tokenUsageQuery.isError ? (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              امکان نمایش مصرف توکن وجود ندارد.
            </Typography>
          ) : (
            <>
              <LinearProgress
                variant="determinate"
                value={usagePercent}
                sx={{ height: 6, borderRadius: 1, mb: 1 }}
              />
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {usageLimit > 0
                    ? `${formatNumber(currentUsage)} از ${formatNumber(usageLimit)}`
                    : formatNumber(currentUsage)}
                </Typography>
                <Box sx={{ flex: 1 }} />
                {usageLimit > 0 && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {formatNumber(remainingUsage)} باقی‌مانده
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </Box>

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
