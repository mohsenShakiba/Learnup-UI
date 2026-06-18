import { Box, Card, Icon, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { VocabsService } from '../../api/Learnup';
import { AppLoader } from '../../shared/components/AppLoader';
import { DefaultHeader } from '../../shared/components/DefaultHeader';
import { Scaffold } from '../../shared/components/Scaffold';
import { VocabListItem } from './components/VocabListItem';

export default function VocabSearchPage () {
  const [input, setInput] = useState('');
  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchWord(input.trim()), 200);
    return () => clearTimeout(timer);
  }, [input]);

  const query = useQuery({
    queryKey: ['vocab-search', searchWord],
    queryFn: () => VocabsService.getVocabByWord(searchWord),
    enabled: searchWord.length > 0,
  });

  return (
    <Scaffold header={<DefaultHeader header='جستجوی لغت' />}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          placeholder='جستجوی کلمات و لغات'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon>search</Icon>
                </InputAdornment>
              ),
            },
          }}
        />

        {input.length === 0 && (
          <Card sx={{ p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, position: 'relative' }}>
              جستجوی کلمات
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', position: 'relative' }}>
              می‌توانید لغات را به فارسی یا انگلیسی جستجو کنید
            </Typography>
          </Card>
        )}

        {query.isLoading && <AppLoader />}

        {query.isError && (
          <Typography color="error" >خطا در جستجو</Typography>
        )}

        {query.data && query.data.length === 0 && (
          <Typography color="text.secondary" >نتیجه‌ای یافت نشد</Typography>
        )}

        {query.data && query.data.length > 0 && (
          <Stack spacing={1.5}>
            {query.data.map((vocab) => (
              <VocabListItem key={vocab.id} vocab={vocab} />
            ))}
          </Stack>
        )}
      </Stack>
    </Scaffold>
  );
}
