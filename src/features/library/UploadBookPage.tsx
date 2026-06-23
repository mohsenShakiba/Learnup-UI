import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ePub from 'epubjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BooksControllersService } from '../../api/Learnup';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';

export default function UploadBookPage () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<Blob | null>(null);
  const [meta, setMeta] = useState<BookMeta | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleSelect = async (selected: File | null) => {
    setFile(selected);
    setCover(null);
    setMeta(null);
    if (!selected) return;

    setParsing(true);
    try {
      const book = ePub(await selected.arrayBuffer());
      const metadata = await book.loaded.metadata;

      const coverHref = await book.loaded.cover;
      if (coverHref) {
        const coverBlob = await book.archive.getBlob(coverHref);
        setCover(coverBlob);
      }

      setMeta({
        title: metadata.title?.trim() || selected.name.replace(/\.epub$/i, ''),
      });
    } finally {
      setParsing(false);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: () =>
      BooksControllersService.uploadUserBook({
        Title: meta?.title,
        File: file ?? undefined,
        CoverImage: cover ?? undefined
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBooks'] });
      navigate('/library');
    },
  });

  const canSubmit = !!file && !!meta && !parsing && !uploadMutation.isPending;

  return (
    <Scaffold header={
      <DefaultHeader header='آپلود کتاب' />
    }>
      <Stack spacing={2}>

        <Alert severity='info'>
          فقط کتاب های فرمت epub قابل استفاده میباشد.
        </Alert>

        <FilePicker
          label="فایل کتاب (EPUB)"
          accept=".epub,application/epub+zip"
          file={file}
          onSelect={handleSelect}
        />

        {parsing && (
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            در حال پردازش اطلاعات کتاب...
          </Typography>
        )}

        {uploadMutation.isError && (
          <Typography variant="caption" color="error">
            بارگذاری ناموفق بود. دوباره تلاش کن.
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          disabled={!canSubmit}
          onClick={() => uploadMutation.mutate()}
        >
          آپلود کتاب
        </Button>
      </Stack>
    </Scaffold>
  );
}

type BookMeta = {
  title: string;
};

type FilePickerProps = {
  label: string;
  accept: string;
  file: File | null;
  onSelect: (file: File | null) => void;
};

function FilePicker ({ label, accept, file, onSelect }: FilePickerProps) {
  return (
    <Box
      component="label"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        cursor: 'pointer',
      }}
    >
      <span className="material-icons" style={{ opacity: 0.6 }}>upload_file</span>
      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>{label}</Typography>
        <Typography noWrap sx={{ fontSize: '0.9rem' }}>
          {file ? file.name : 'انتخاب فایل'}
        </Typography>
      </Stack>
      <input
        type="file"
        accept={accept}
        hidden
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
    </Box>
  );
}
