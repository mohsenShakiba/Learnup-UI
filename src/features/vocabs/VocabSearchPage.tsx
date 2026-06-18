import { Icon, InputAdornment, Stack, TextField, Typography } from '@mui/material';
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
          placeholder='جستجو کنید...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
