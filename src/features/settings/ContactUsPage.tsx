import { Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { FancyButton } from "../../shared/components/FancyButton";
import { Scaffold } from "../../shared/components/Scaffold";
import { toast } from "../../shared/toast";

export default function ContactUsPage() {
  const [message, setMessage] = useState("");

  const canSubmit = message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    console.log("Contact us message:", message.trim());
    toast.success("پیام شما ارسال شد.");
    setMessage("");
  };

  return (
    <Scaffold
      disableBottomPadding
      header={<DefaultHeader header="ارتباط با ما" />}
    >
      <Stack spacing={2.5}>
        <Typography variant="body2" color="text.secondary">
          اگر پیشنهاد، سوال یا نظری دارید، برای ما بنویسید.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="سخنی با ما"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            minRows={5}
            fullWidth
          />

          <FancyButton onClick={handleSubmit} disabled={!canSubmit}>
            ارسال
          </FancyButton>
        </Stack>
      </Stack>
    </Scaffold>
  );
}
