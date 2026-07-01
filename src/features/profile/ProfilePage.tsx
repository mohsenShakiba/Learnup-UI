import { Icon } from '../../shared/components/Icon';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { UsersService } from '../../api/Learnup';
import { getFileById } from '../../services/fetchFile';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { toast } from '../../shared/toast/toastStore';

export default function ProfilePage () {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => UsersService.getProfile(),
  });

  const profile = profileQuery.data;
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

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

  const updateMutation = useMutation({
    mutationFn: () =>
      UsersService.updateProfile({
        displayName,
        avatarUrl: profile?.avatarUrl ?? null,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);
      toast.success('پروفایل با موفقیت ذخیره شد');
    },
    onError: () => {
      toast.error('خطا در ذخیره پروفایل');
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => UsersService.uploadAvatar({ File: file }),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);
      toast.success('تصویر پروفایل بارگذاری شد');
    },
    onError: () => {
      toast.error('خطا در بارگذاری تصویر');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      avatarMutation.mutate(file);
    }
    e.target.value = '';
  };

  const isDirty = displayName !== profile?.displayName;

  return (
    <Scaffold header={<DefaultHeader header="پروفایل" />}>
      <Stack spacing={3} sx={{ pb: 2 }}>
        <Stack spacing={1} sx={{ pt: 2 }}>
          <Box sx={{ position: 'relative' }}>
            {profileQuery.isLoading ? (
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                }}
              >
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Avatar
                src={avatarUrl ?? undefined}
                sx={{ width: 96, height: 96, fontSize: '2.5rem' }}
              >
                {!avatarUrl && (profile?.displayName?.[0]?.toUpperCase() ?? '?')}
              </Avatar>
            )}
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarMutation.isPending || profileQuery.isLoading}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                width: 28,
                height: 28,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              {avatarMutation.isPending ? (
                <CircularProgress size={14} />
              ) : (
                <Icon sx={{ fontSize: 16 }}>edit</Icon>
              )}
            </IconButton>
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          {profile && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {profile.displayName}
            </Typography>
          )}
        </Stack>

        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              ویرایش اطلاعات
            </Typography>
            <TextField
              label="نام نمایشی"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              size="small"
              disabled={profileQuery.isLoading}
            />
            <Button
              variant="contained"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending || !displayName.trim() || !isDirty}
              fullWidth
            >
              {updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'ذخیره تغییرات'}
            </Button>
          </Stack>
        </Paper>

        {profile && (
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                عضویت از
              </Typography>
              <Typography variant="body2">
                {new Date(profile.createdAt).toLocaleDateString('fa-IR')}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                آخرین ورود
              </Typography>
              <Typography variant="body2">
                {profile.lastLogin
                  ? new Date(profile.lastLogin).toLocaleDateString('fa-IR')
                  : '-'}
              </Typography>
            </Box>
          </Paper>
        )}
      </Stack>
    </Scaffold>
  );
}
