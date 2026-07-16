import type { ErrorKind, ReportSection } from "./reportStorage";

export type LessonPart = "conversation" | "grammar" | "vocab" | "test";

export const lessonPartOptions: { value: LessonPart; label: string }[] = [
  { value: "conversation", label: "مکالمه" },
  { value: "grammar", label: "گرامر" },
  { value: "vocab", label: "واژگان" },
  { value: "test", label: "آزمون" },
];

export const bookTypeOptions = [
  { value: "ebook", label: "کتاب" },
  { value: "audiobook", label: "کتاب صوتی" },
] as const;

type SectionErrorConfig = {
  helperText: string;
  requiredFields: string[];
};

const sectionErrorConfigs: Record<
  ErrorKind,
  Record<ReportSection, SectionErrorConfig>
> = {
  "app-functionality": {
    courses: {
      helperText:
        "دوره، درس و بخش مربوطه را انتخاب کنید و توضیح دهید چه مشکلی در عملکرد برنامه دیده اید.",
      requiredFields: ["courseId", "lessonId", "lessonPart", "issueDetails"],
    },
    leitner: {
      helperText:
        "سطح لایتنر را انتخاب کنید و توضیح دهید چه مشکلی در عملکرد این بخش دیده اید.",
      requiredFields: ["boxLevelId", "issueDetails"],
    },
    books: {
      helperText:
        "کتاب مربوطه را انتخاب کنید و توضیح دهید چه مشکلی در عملکرد بخش کتاب دیده اید.",
      requiredFields: ["bookType", "bookId", "issueDetails"],
    },
    grammar: {
      helperText:
        "مبحث گرامر را انتخاب کنید و توضیح دهید چه مشکلی در عملکرد این بخش دیده اید.",
      requiredFields: ["grammarId", "issueDetails"],
    },
    vocabs: {
      helperText:
        "دوره و درس مربوطه را انتخاب کنید و توضیح دهید چه مشکلی در بخش واژگان دیده اید.",
      requiredFields: ["courseId", "lessonId", "issueDetails"],
    },
    chat: {
      helperText:
        "گفتگو را انتخاب کنید و توضیح دهید چه مشکلی در عملکرد دستیار دیده اید.",
      requiredFields: ["chatId", "issueDetails"],
    },
  },
  "data-error": {
    courses: {
      helperText:
        "دوره، درس، بخش و آیتم دارای خطا را انتخاب کنید و داده اشتباه را توضیح دهید.",
      requiredFields: [
        "courseId",
        "lessonId",
        "lessonPart",
        "itemId",
        "wrongContent",
        "issueDetails",
      ],
    },
    leitner: {
      helperText:
        "سطح و کارت لایتنر را انتخاب کنید و توضیح دهید کدام داده اشتباه است.",
      requiredFields: ["boxLevelId", "cardId", "wrongContent", "issueDetails"],
    },
    books: {
      helperText:
        "کتاب و محل دقیق خطا را مشخص کنید و داده اشتباه را توضیح دهید.",
      requiredFields: [
        "bookType",
        "bookId",
        "location",
        "wrongContent",
        "issueDetails",
      ],
    },
    grammar: {
      helperText:
        "مبحث گرامر را انتخاب کنید و متن یا توضیح اشتباه را وارد کنید.",
      requiredFields: ["grammarId", "wrongContent", "issueDetails"],
    },
    vocabs: {
      helperText:
        "دوره، درس و واژه دارای خطا را انتخاب کنید و داده اشتباه را توضیح دهید.",
      requiredFields: [
        "courseId",
        "lessonId",
        "vocabId",
        "wrongContent",
        "issueDetails",
      ],
    },
    chat: {
      helperText:
        "گفتگو را انتخاب کنید و پیام یا پاسخ اشتباه را توضیح دهید.",
      requiredFields: ["chatId", "wrongContent", "issueDetails"],
    },
  },
};

export function getSectionHelperText(
  errorKind: ErrorKind,
  section: ReportSection,
) {
  return sectionErrorConfigs[errorKind][section].helperText;
}

export function getRequiredFieldNames(
  errorKind: ErrorKind,
  section: ReportSection,
) {
  return sectionErrorConfigs[errorKind][section].requiredFields;
}

export function isReportFormValid(
  errorKind: ErrorKind,
  section: ReportSection,
  values: Record<string, string>,
) {
  return getRequiredFieldNames(errorKind, section).every((fieldName) => {
    if (
      fieldName === "cardId" &&
      section === "leitner" &&
      errorKind === "data-error"
    ) {
      return Boolean(values.cardId?.trim() || values.cardLabel?.trim());
    }

    return values[fieldName]?.trim().length > 0;
  });
}

export function createEmptyReportValues() {
  return {
    courseId: "",
    courseName: "",
    lessonId: "",
    lessonName: "",
    lessonPart: "",
    lessonPartLabel: "",
    itemId: "",
    itemLabel: "",
    vocabId: "",
    vocabLabel: "",
    boxLevelId: "",
    boxLevelLabel: "",
    cardId: "",
    cardLabel: "",
    bookType: "",
    bookTypeLabel: "",
    bookId: "",
    bookLabel: "",
    grammarId: "",
    grammarLabel: "",
    chatId: "",
    chatLabel: "",
    location: "",
    wrongContent: "",
    issueDetails: "",
  };
}

export type ReportFormValues = ReturnType<typeof createEmptyReportValues>;
