import { Alert, Box, Button, Typography } from '@mui/material';

type ErrorPageProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorPage ({
  title = 'خطا!',
  message = 'خطا در دریافت اطلاعات',
  actionLabel,
  onAction,
}: ErrorPageProps) {
  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        boxSizing: 'border-box',
      }}
    >
      <Alert
        severity="error"
        sx={{
          width: '100%',
          maxWidth: 520,
          textAlign: 'left',
        }}
        action={
          onAction && actionLabel ? (
            <Button color="inherit" size="small" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : undefined
        }
      >
        <Typography component="h1" variant="h6" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography component="p" variant="body2">
          {message}
        </Typography>
      </Alert>
    </Box>
  );
}
