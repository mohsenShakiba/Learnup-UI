export type ErrorKind = "app-functionality" | "data-error";
export type ReportSection =
  | "courses"
  | "leitner"
  | "books"
  | "grammar"
  | "vocabs"
  | "chat";

export type SectionConfig = {
  label: string;
};

export type ReportStatus = "pending" | "reviewed" | "resolved";

export type InvalidDataReport = {
  id: string;
  createdAt: string;
  errorKind: ErrorKind;
  section: ReportSection;
  sectionLabel: string;
  details: Record<string, string>;
  isCurrentPage: boolean;
  customText: string;
  status: ReportStatus;
};

const STORAGE_KEY = "learnup.invalidDataReports";

export const errorKinds: { value: ErrorKind; label: string; description: string }[] = [
  {
    value: "app-functionality",
    label: "مشکل عملکرد برنامه",
    description:
      "مثلا دکمه کار نمی کند، صفحه باز نمی شود یا چیزی اشتباه نمایش داده می شود.",
  },
  {
    value: "data-error",
    label: "خطای داده",
    description: "مثلا متن، معنی، سوال، پاسخ یا محتوای آموزشی اشتباه است.",
  },
];

export const sectionConfigs: Record<ReportSection, SectionConfig> = {
  courses: { label: "دوره ها" },
  leitner: { label: "لایتنر" },
  books: { label: "بخش کتاب" },
  grammar: { label: "گرامر" },
  vocabs: { label: "واژگان" },
  chat: { label: "چت و دستیار" },
};

export function getErrorKindLabel(value: ErrorKind) {
  return errorKinds.find((item) => item.value === value)?.label ?? value;
}

export function readInvalidDataReports(): InvalidDataReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInvalidDataReport(report: InvalidDataReport) {
  const currentReports = readInvalidDataReports();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([report, ...currentReports]));
}
