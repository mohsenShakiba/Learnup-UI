import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../api/Learnup";
import { FancyButton } from "../../shared/components/FancyButton";
import { Scaffold } from "../../shared/components/Scaffold";
import { toast } from "../../shared/toast";
import { useAuthStore } from "../../stores/authStore";

type Step = "mobile" | "otp";

const MOBILE_PATTERN = /^09\d{9}$/;

interface LocationState {
  from?: string;
}

export default function LoginPage () {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const [step, setStep] = useState<Step>("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [code, setCode] = useState("");

  const redirectTo = (location.state as LocationState | null)?.from ?? "/";

  // Already signed in (e.g. navigated here manually) — bounce to the app.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const sendOtpMutation = useMutation({
    mutationFn: () => AuthService.sendOtp({ mobileNumber }),
    onSuccess: () => {
      setStep("otp");
      setCode("");
      toast.success("کد تایید برای شما ارسال شد.");
    },
    onError: () => {
      toast.error("ارسال کد با خطا مواجه شد. دوباره تلاش کنید.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => AuthService.verifyOtp({ mobileNumber, code }),
    onSuccess: (response) => {
      setAuth(response.accessToken, response.expiresAt);
      navigate(redirectTo, { replace: true });
    },
    onError: () => {
      toast.error("کد وارد شده صحیح نیست.");
    },
  });

  const isMobileValid = MOBILE_PATTERN.test(mobileNumber);
  const isCodeValid = code.trim().length >= 4;

  const handleSendOtp = () => {
    if (!isMobileValid || sendOtpMutation.isPending) return;
    sendOtpMutation.mutate();
  };

  const handleVerifyOtp = () => {
    if (!isCodeValid || verifyOtpMutation.isPending) return;
    verifyOtpMutation.mutate();
  };

  const handleChangeMobile = () => {
    setStep("mobile");
    setCode("");
  };

  return (
    <Scaffold>
      <Stack
        spacing={3}
        sx={{ maxWidth: 360, mx: "auto", mt: 6, textAlign: "center" }}
      >
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            ورود به لرن‌آپ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step === "mobile"
              ? "شماره موبایل خود را وارد کنید تا کد تایید برایتان ارسال شود."
              : `کد تایید ارسال‌شده به ${mobileNumber} را وارد کنید.`}
          </Typography>
        </Stack>

        {step === "mobile" ? (
          <Stack spacing={2}>
            <TextField
              fullWidth
              type="tel"
              autoFocus
              label="شماره موبایل"
              placeholder="09xxxxxxxxx"
              value={mobileNumber}
              onChange={(event) =>
                setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 11))
              }
              onKeyDown={(event) => event.key === "Enter" && handleSendOtp()}
              error={mobileNumber.length > 0 && !isMobileValid}
              helperText={
                mobileNumber.length > 0 && !isMobileValid
                  ? "شماره موبایل معتبر نیست."
                  : " "
              }
              slotProps={{ htmlInput: { inputMode: "numeric", dir: "ltr" } }}
            />
            <FancyButton
              fullWidth
              size="large"
              onClick={handleSendOtp}
              disabled={!isMobileValid || sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? "در حال ارسال..." : "ارسال کد"}
            </FancyButton>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <TextField
              fullWidth
              type="tel"
              autoFocus
              label="کد تایید"
              placeholder="------"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              onKeyDown={(event) => event.key === "Enter" && handleVerifyOtp()}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  dir: "ltr",
                  style: { textAlign: "center", letterSpacing: "0.4em" },
                },
              }}
            />
            <FancyButton
              fullWidth
              size="large"
              onClick={handleVerifyOtp}
              disabled={!isCodeValid || verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "در حال ورود..." : "ورود"}
            </FancyButton>

            <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
              <Button variant="text" size="small" onClick={handleChangeMobile}>
                تغییر شماره
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleSendOtp}
                disabled={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending ? "در حال ارسال..." : "ارسال مجدد کد"}
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Scaffold>
  );
}
