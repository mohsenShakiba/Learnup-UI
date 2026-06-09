import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LessonResponse } from '../../../api/Learnup';
import { OpenAPI } from '../../../api/Learnup';

type LessonListItemProps = {
  lesson: LessonResponse;
};

const FALLBACK_COVER = '/images/story_cover.png';

function StoryIcon ({ completed }: { completed: boolean; }) {
  return (

    <Box sx={{
      bgcolor: completed ? 'success.dark' : 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      backdropFilter: 'blur(5px)', width: 30, height: 30, lineHeight: '30px', alignItems: 'center', justifyContent: 'center', display: 'flex'
    }}>
      <Icon sx={{
        color: completed ? 'white' : 'rgba(255,255,255,0.35)',
      }}>
        auto_stories
      </Icon>
    </Box>
  );
}

function GrammarIcon ({ completed }: { completed: boolean; }) {
  return (
    <Box>
      <Icon sx={{ color: completed ? 'success.light' : 'rgba(255,255,255,0.35)' }}>
        lightbulb
      </Icon>
    </Box>
  );
}

export function LessonListItem ({ lesson }: LessonListItemProps) {
  const navigate = useNavigate();

  const coverUrl = lesson.coverId
    ? `${OpenAPI.BASE}/Mobile/Files/${lesson.coverId}`
    : FALLBACK_COVER;

  return (
    <Box
      onClick={() => navigate(`/lessons/${lesson.id}`)}
      sx={{
        position: 'relative',
        height: 150,
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        '&:active': { transform: 'scale(0.97)', opacity: 0.85 },
      }}
    >
      {/* Full-bleed cover image */}
      <Box
        component="img"
        src={coverUrl}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.0) 100%)',
        }}
      />

      {/* Badge + title */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ position: 'absolute', inset: 0, px: 2, alignItems: 'center', justifyContent: 'flex-start' }}
      >
        <Stack spacing={0.5} sx={{ overflow: 'hidden', alignItems: 'flex-start' }}>
          <Box
            sx={{
              px: 0.8,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'secondary.dark',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: '0.6rem' }}>
              LESSON {lesson.order}
            </Typography>
          </Box>

          <Typography
            variant="subtitle2"
            sx={{
              color: '#fff',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            {lesson.title.toUpperCase()}
          </Typography>
        </Stack>
      </Stack>

      {/* Progress indicators */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ position: 'absolute', bottom: 16, left: 16, alignItems: 'center' }}
      >
        {lesson.storiesCount > 0 && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {Array.from({ length: lesson.storiesCount }).map((_, i) => (
              <StoryIcon key={i} completed={i < lesson.completedStoriesCount} />
            ))}
          </Stack>
        )}

        {lesson.grammarsCount > 0 && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {Array.from({ length: lesson.grammarsCount }).map((_, i) => (
              <GrammarIcon key={i} completed={i < lesson.completedGrammarsCount} />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
