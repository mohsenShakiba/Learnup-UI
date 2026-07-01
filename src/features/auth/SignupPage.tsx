import { Icon } from '../../shared/components/Icon';
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../api/Learnup";
import { FancyButton } from "../../shared/components/FancyButton";
import { Scaffold } from "../../shared/components/Scaffold";
import { toast } from "../../shared/toast";
import { useAuthStore } from "../../stores/authStore";

interface SignupLocationState {
  mobileNumber?: string;
  code?: string;
  from?: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const state = location.state as SignupLocationState | null;

  const mobileNumber = state?.mobileNumber ?? "";
  const code = state?.code ?? "";
  const redirectTo = state?.from ?? "/";
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!mobileNumber || !code) {
      navigate("/login", { replace: true, state: { from: redirectTo } });
      return;
    }

    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [code, isAuthenticated, mobileNumber, navigate, redirectTo]);

  const completeSignupMutation = useMutation({
    mutationFn: () =>
      AuthService.completeSignup({
        mobileNumber,
        code,
        displayName: displayName.trim(),
        avatarUrl: null,
      }),
    onSuccess: (response) => {
      if (!response.accessToken || !response.expiresAt) {
        toast.error("ثبت نام کامل نشد. دوباره کد تایید بگیرید.");
        navigate("/login", { replace: true, state: { from: redirectTo } });
        return;
      }

      setAuth(response.accessToken, response.expiresAt);
      toast.success("ثبت نام شما کامل شد.");
      navigate(redirectTo, { replace: true });
    },
    onError: () => {
      toast.error("ثبت نام کامل نشد. دوباره تلاش کنید.");
    },
  });

  const trimmedDisplayName = displayName.trim();
  const isDisplayNameValid =
    trimmedDisplayName.length >= 2 && trimmedDisplayName.length <= 100;

  const handleSubmit = () => {
    if (!isDisplayNameValid || completeSignupMutation.isPending) return;
    completeSignupMutation.mutate();
  };

  return (
    <Scaffold>
      <Stack
        spacing={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          mt: 5,
          pb: 3,
          textAlign: "center",
        }}
      >
        <Stack spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Icon sx={{ fontSize: 30 }}>person_add</Icon>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            تکمیل ثبت نام
          </Typography>
          <Typography variant="body2" color="text.secondary">
            برای شماره {mobileNumber} حسابی پیدا نشد. نام نمایشی خود را وارد کنید تا پروفایل شما ساخته شود.
          </Typography>
        </Stack>

        <Paper sx={{ p: 2.5 }}>
          <Stack spacing={2.25}>
            <TextField
              fullWidth
              autoFocus
              label="نام نمایشی"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value.slice(0, 100))}
              onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
              error={displayName.length > 0 && !isDisplayNameValid}
              helperText={
                displayName.length > 0 && !isDisplayNameValid
                  ? "نام نمایشی باید حداقل ۲ کاراکتر باشد."
                  : "این نام در پروفایل و بخش های برنامه نمایش داده می شود."
              }
            />

            <FancyButton
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={!isDisplayNameValid || completeSignupMutation.isPending}
            >
              {completeSignupMutation.isPending ? "در حال ساخت حساب..." : "ساخت حساب"}
            </FancyButton>
          </Stack>
        </Paper>

        <Button
          variant="text"
          size="small"
          onClick={() => navigate("/login", { replace: true, state: { from: redirectTo } })}
          startIcon={<Icon sx={{ fontSize: 18 }}>arrow_forward</Icon>}
        >
          تغییر شماره موبایل
        </Button>
      </Stack>
    </Scaffold>
  );
}
