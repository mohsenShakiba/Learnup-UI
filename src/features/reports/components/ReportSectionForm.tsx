import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  AudioBooksService,
  BooksControllersService,
  ChatsService,
  CoursesService,
  GrammarsService,
  LeitnerBoxService,
  LessonsService,
} from "../../../api/Learnup";
import type { LessonDetailResponse } from "../../../api/Learnup/models/LessonDetailResponse";
import {
  bookTypeOptions,
  lessonPartOptions,
  type LessonPart,
  type ReportFormValues,
} from "../reportFieldConfig";
import type { ErrorKind, ReportSection } from "../reportStorage";

type ReportSectionFormProps = {
  errorKind: ErrorKind;
  section: ReportSection;
  values: ReportFormValues;
  onChange: (values: ReportFormValues) => void;
};

type SelectOption = {
  value: string;
  label: string;
};

function ReportSelectField({
  label,
  value,
  options,
  disabled,
  loading,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
  onChange: (value: string, label: string) => void;
}) {
  return (
    <FormControl fullWidth disabled={disabled || loading}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          const option = options.find((item) => item.value === nextValue);
          onChange(nextValue, option?.label ?? "");
        }}
      >
        {loading ? (
          <MenuItem disabled value="">
            در حال بارگذاری...
          </MenuItem>
        ) : options.length === 0 ? (
          <MenuItem disabled value="">
            موردی یافت نشد
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

function getLessonItemOptions(
  lesson: LessonDetailResponse,
  lessonPart: LessonPart,
): SelectOption[] {
  switch (lessonPart) {
    case "conversation":
      return lesson.conversations.map((item) => ({
        value: String(item.id),
        label: item.title,
      }));
    case "grammar":
      return lesson.grammars.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
    case "vocab":
      return lesson.vocabs.map((item) => ({
        value: String(item.id),
        label: item.word,
      }));
    case "test":
      return lesson.tests.map((item) => ({
        value: String(item.id),
        label: item.question,
      }));
    default:
      return [];
  }
}

export function ReportSectionForm({
  errorKind,
  section,
  values,
  onChange,
}: ReportSectionFormProps) {
  const courseId = Number(values.courseId);
  const lessonId = Number(values.lessonId);
  const boxLevelId = Number(values.boxLevelId);
  const needsCourses = section === "courses" || section === "vocabs";
  const needsLessons = needsCourses && courseId > 0;
  const needsLessonDetail =
    (section === "courses" && errorKind === "data-error" && lessonId > 0) ||
    (section === "vocabs" && errorKind === "data-error" && lessonId > 0);

  const coursesQuery = useQuery({
    queryKey: ["report", "courses"],
    queryFn: () => CoursesService.getCoursesByLanguageId(1),
    enabled: needsCourses,
  });

  const lessonsQuery = useQuery({
    queryKey: ["report", "lessons", courseId],
    queryFn: () => LessonsService.getLessonsByCourseId(courseId),
    enabled: needsLessons,
  });

  const lessonDetailQuery = useQuery({
    queryKey: ["report", "lesson-detail", lessonId],
    queryFn: () => LessonsService.getLessonById(lessonId),
    enabled: needsLessonDetail,
  });

  const leitnerLevelsQuery = useQuery({
    queryKey: ["report", "leitner-levels"],
    queryFn: () => LeitnerBoxService.getBoxLevelsInfo(),
    enabled: section === "leitner",
  });

  const leitnerCardsQuery = useQuery({
    queryKey: ["report", "leitner-cards", boxLevelId],
    queryFn: () => LeitnerBoxService.getDueWordsByBoxLevelId(boxLevelId),
    enabled: section === "leitner" && errorKind === "data-error" && boxLevelId > 0,
  });

  const ebooksQuery = useQuery({
    queryKey: ["report", "ebooks"],
    queryFn: () => BooksControllersService.getUserBooks(),
    enabled: section === "books" && values.bookType === "ebook",
  });

  const audioBooksQuery = useQuery({
    queryKey: ["report", "audiobooks"],
    queryFn: () => AudioBooksService.getMobileAudioBooks(),
    enabled: section === "books" && values.bookType === "audiobook",
  });

  const grammarsQuery = useQuery({
    queryKey: ["report", "grammars"],
    queryFn: () => GrammarsService.getMobileGrammars1(),
    enabled: section === "grammar",
  });

  const chatsQuery = useQuery({
    queryKey: ["report", "chats"],
    queryFn: () => ChatsService.listChats(),
    enabled: section === "chat",
  });

  const courseOptions =
    coursesQuery.data?.map((course) => ({
      value: String(course.id),
      label: course.title || course.code,
    })) ?? [];

  const lessonOptions =
    lessonsQuery.data?.map((lesson) => ({
      value: String(lesson.id),
      label: lesson.title || `درس ${lesson.order}`,
    })) ?? [];

  const lessonPart = values.lessonPart as LessonPart;
  const lessonItemOptions =
    lessonDetailQuery.data && lessonPart
      ? getLessonItemOptions(lessonDetailQuery.data, lessonPart)
      : [];

  const vocabOptions =
    lessonDetailQuery.data?.vocabs.map((vocab) => ({
      value: String(vocab.id),
      label: vocab.word,
    })) ?? [];

  const boxLevelOptions =
    leitnerLevelsQuery.data?.levels.map((level) => ({
      value: String(level.id),
      label: `سطح ${level.level}`,
    })) ?? [];

  const cardOptions =
    leitnerCardsQuery.data?.map((card) => ({
      value: String(card.id),
      label: card.word,
    })) ?? [];

  const bookOptions =
    values.bookType === "ebook"
      ? (ebooksQuery.data?.map((book) => ({
          value: String(book.id),
          label: book.title,
        })) ?? [])
      : values.bookType === "audiobook"
        ? (audioBooksQuery.data?.map((book) => ({
            value: String(book.id),
            label: book.title,
          })) ?? [])
        : [];

  const grammarOptions =
    grammarsQuery.data?.map((grammar) => ({
      value: String(grammar.id),
      label: grammar.name,
    })) ?? [];

  const chatOptions =
    chatsQuery.data?.map((chat) => ({
      value: String(chat.id),
      label: chat.title?.trim() || `گفتگو ${chat.id}`,
    })) ?? [];

  const updateValues = (patch: Partial<ReportFormValues>) => {
    onChange({ ...values, ...patch });
  };

  const renderCoursesFields = () => (
    <Stack spacing={1.5}>
      <ReportSelectField
        label="دوره"
        value={values.courseId}
        options={courseOptions}
        loading={coursesQuery.isLoading}
        onChange={(courseId, courseName) =>
          updateValues({
            courseId,
            courseName,
            lessonId: "",
            lessonName: "",
            lessonPart: "",
            lessonPartLabel: "",
            itemId: "",
            itemLabel: "",
          })
        }
      />

      <ReportSelectField
        label="درس"
        value={values.lessonId}
        options={lessonOptions}
        disabled={!values.courseId}
        loading={lessonsQuery.isLoading}
        onChange={(lessonId, lessonName) =>
          updateValues({
            lessonId,
            lessonName,
            lessonPart: "",
            lessonPartLabel: "",
            itemId: "",
            itemLabel: "",
            vocabId: "",
            vocabLabel: "",
          })
        }
      />

      <ReportSelectField
        label="بخش درس"
        value={values.lessonPart}
        options={lessonPartOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        disabled={!values.lessonId}
        onChange={(lessonPart, lessonPartLabel) =>
          updateValues({
            lessonPart,
            lessonPartLabel,
            itemId: "",
            itemLabel: "",
          })
        }
      />

      {errorKind === "data-error" && (
        <ReportSelectField
          label="آیتم دارای خطا"
          value={values.itemId}
          options={lessonItemOptions}
          disabled={!values.lessonPart}
          loading={lessonDetailQuery.isLoading}
          onChange={(itemId, itemLabel) => updateValues({ itemId, itemLabel })}
        />
      )}

      {errorKind === "data-error" ? (
        <TextField
          label="داده اشتباه"
          value={values.wrongContent}
          onChange={(event) =>
            updateValues({ wrongContent: event.target.value })
          }
          multiline
          minRows={2}
          fullWidth
        />
      ) : null}

      <TextField
        label="شرح مشکل"
        value={values.issueDetails}
        onChange={(event) => updateValues({ issueDetails: event.target.value })}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );

  const renderVocabsFields = () => (
    <Stack spacing={1.5}>
      <ReportSelectField
        label="دوره"
        value={values.courseId}
        options={courseOptions}
        loading={coursesQuery.isLoading}
        onChange={(courseId, courseName) =>
          updateValues({
            courseId,
            courseName,
            lessonId: "",
            lessonName: "",
            vocabId: "",
            vocabLabel: "",
          })
        }
      />

      <ReportSelectField
        label="درس"
        value={values.lessonId}
        options={lessonOptions}
        disabled={!values.courseId}
        loading={lessonsQuery.isLoading}
        onChange={(lessonId, lessonName) =>
          updateValues({
            lessonId,
            lessonName,
            vocabId: "",
            vocabLabel: "",
          })
        }
      />

      {errorKind === "data-error" && (
        <ReportSelectField
          label="واژه دارای خطا"
          value={values.vocabId}
          options={vocabOptions}
          disabled={!values.lessonId}
          loading={lessonDetailQuery.isLoading}
          onChange={(vocabId, vocabLabel) => updateValues({ vocabId, vocabLabel })}
        />
      )}

      {errorKind === "data-error" ? (
        <TextField
          label="داده اشتباه"
          value={values.wrongContent}
          onChange={(event) =>
            updateValues({ wrongContent: event.target.value })
          }
          multiline
          minRows={2}
          fullWidth
        />
      ) : null}

      <TextField
        label="شرح مشکل"
        value={values.issueDetails}
        onChange={(event) => updateValues({ issueDetails: event.target.value })}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );

  const renderLeitnerFields = () => (
    <Stack spacing={1.5}>
      <ReportSelectField
        label="سطح لایتنر"
        value={values.boxLevelId}
        options={boxLevelOptions}
        loading={leitnerLevelsQuery.isLoading}
        onChange={(boxLevelId, boxLevelLabel) =>
          updateValues({
            boxLevelId,
            boxLevelLabel,
            cardId: "",
            cardLabel: "",
          })
        }
      />

      {errorKind === "data-error" && (
        <>
          {cardOptions.length > 0 ? (
            <ReportSelectField
              label="کارت"
              value={values.cardId}
              options={cardOptions}
              disabled={!values.boxLevelId}
              loading={leitnerCardsQuery.isLoading}
              onChange={(cardId, cardLabel) =>
                updateValues({ cardId, cardLabel })
              }
            />
          ) : (
            <TextField
              label="کلمه یا کارت"
              value={values.cardLabel}
              onChange={(event) =>
                updateValues({ cardId: "", cardLabel: event.target.value })
              }
              disabled={!values.boxLevelId || leitnerCardsQuery.isLoading}
              fullWidth
            />
          )}
          {values.boxLevelId &&
            !leitnerCardsQuery.isLoading &&
            cardOptions.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                کارتی برای این سطح در دسترس نبود؛ نام کارت را دستی وارد کنید.
              </Typography>
            )}
        </>
      )}

      {errorKind === "data-error" ? (
        <TextField
          label="داده اشتباه"
          value={values.wrongContent}
          onChange={(event) =>
            updateValues({ wrongContent: event.target.value })
          }
          multiline
          minRows={2}
          fullWidth
        />
      ) : null}

      <TextField
        label="شرح مشکل"
        value={values.issueDetails}
        onChange={(event) => updateValues({ issueDetails: event.target.value })}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );

  const renderBooksFields = () => (
    <Stack spacing={1.5}>
      <ReportSelectField
        label="نوع کتاب"
        value={values.bookType}
        options={bookTypeOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        onChange={(bookType, bookTypeLabel) =>
          updateValues({
            bookType,
            bookTypeLabel,
            bookId: "",
            bookLabel: "",
          })
        }
      />

      <ReportSelectField
        label="کتاب"
        value={values.bookId}
        options={bookOptions}
        disabled={!values.bookType}
        loading={
          values.bookType === "ebook"
            ? ebooksQuery.isLoading
            : audioBooksQuery.isLoading
        }
        onChange={(bookId, bookLabel) => updateValues({ bookId, bookLabel })}
      />

      {errorKind === "data-error" && (
        <TextField
          label="فصل، بخش یا شماره صفحه"
          value={values.location}
          onChange={(event) => updateValues({ location: event.target.value })}
          fullWidth
        />
      )}

      {errorKind === "data-error" ? (
        <TextField
          label="داده اشتباه"
          value={values.wrongContent}
          onChange={(event) =>
            updateValues({ wrongContent: event.target.value })
          }
          multiline
          minRows={2}
          fullWidth
        />
      ) : null}

      <TextField
        label="شرح مشکل"
        value={values.issueDetails}
        onChange={(event) => updateValues({ issueDetails: event.target.value })}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );

  const renderGrammarFields = () => (
    <Stack spacing={1.5}>
      <ReportSelectField
        label="مبحث گرامر"
        value={values.grammarId}
        options={grammarOptions}
        loading={grammarsQuery.isLoading}
        onChange={(grammarId, grammarLabel) =>
          updateValues({ grammarId, grammarLabel })
        }
      />

      {errorKind === "data-error" ? (
        <TextField
          label="داده اشتباه"
          value={values.wrongContent}
          onChange={(event) =>
            updateValues({ wrongContent: event.target.value })
          }
          multiline
          minRows={2}
          fullWidth
        />
      ) : null}

      <TextField
        label="شرح مشکل"
        value={values.issueDetails}
        onChange={(event) => updateValues({ issueDetails: event.target.value })}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );

  const renderChatFields = () => (
    <Stack spacing={1.5}>
      <ReportSelectField
        label="گفتگو"
        value={values.chatId}
        options={chatOptions}
        loading={chatsQuery.isLoading}
        onChange={(chatId, chatLabel) => updateValues({ chatId, chatLabel })}
      />

      {errorKind === "data-error" ? (
        <TextField
          label="داده اشتباه"
          value={values.wrongContent}
          onChange={(event) =>
            updateValues({ wrongContent: event.target.value })
          }
          multiline
          minRows={2}
          fullWidth
        />
      ) : null}

      <TextField
        label="شرح مشکل"
        value={values.issueDetails}
        onChange={(event) => updateValues({ issueDetails: event.target.value })}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );

  switch (section) {
    case "courses":
      return renderCoursesFields();
    case "vocabs":
      return renderVocabsFields();
    case "leitner":
      return renderLeitnerFields();
    case "books":
      return renderBooksFields();
    case "grammar":
      return renderGrammarFields();
    case "chat":
      return renderChatFields();
    default:
      return null;
  }
}
