import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyList } from "../../shared/components/EmptyList";
import { FancyButton } from "../../shared/components/FancyButton";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { Scaffold } from "../../shared/components/Scaffold";
import {
  getErrorKindLabel,
  readInvalidDataReports,
  type InvalidDataReport,
  type ReportStatus,
} from "./reportStorage";

const statusMeta: Record<
  ReportStatus,
  { label: string; color: "default" | "warning" | "info" | "success" }
> = {
  pending: { label: "در انتظار بررسی", color: "warning" },
  reviewed: { label: "بررسی شده", color: "info" },
  resolved: { label: "پاسخ داده شده", color: "success" },
};

function buildReportSummary(report: InvalidDataReport) {
  const { details } = report;
  const labelFields = [
    details.itemLabel,
    details.vocabLabel,
    details.cardLabel,
    details.bookLabel,
    details.grammarLabel,
    details.chatLabel,
    details.lessonName,
    details.courseName,
    details.issueDetails,
    details.wrongContent,
  ];

  return labelFields.find((value) => value?.trim()) ?? "";
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function InvalidDataReportListPage() {
  const navigate = useNavigate();

  const reports = useMemo(() => readInvalidDataReports(), []);

  return (
    <Scaffold
      disableBottomPadding
      header={<DefaultHeader header="لیست گزارش ها" />}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            در این صفحه گزارش هایی که ثبت کرده اید را همراه با وضعیت پاسخ مشاهده
            می کنید.
          </Typography>
        </Box>

        <FancyButton onClick={() => navigate("/report/invalid-data")}>
          ثبت گزارش جدید
        </FancyButton>

        {reports.length === 0 ? (
          <EmptyList message="هنوز گزارشی ثبت نکرده اید." />
        ) : (
          <Stack spacing={1.5}>
            {reports.map((report) => {
              const status = statusMeta[report.status];
              const summary = buildReportSummary(report);

              return (
                <Paper key={report.id} sx={{ p: 2, borderRadius: 3 }}>
                  <Stack spacing={1.25}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", justifyContent: "space-between" }}
                    >
                      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2">
                          {report.sectionLabel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(report.createdAt)}
                        </Typography>
                      </Stack>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={getErrorKindLabel(report.errorKind)}
                      />
                      {report.isCurrentPage && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label="در همین صفحه"
                        />
                      )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {summary || "جزئیات بیشتری برای این گزارش ثبت نشده است."}
                    </Typography>

                    {report.customText && (
                      <Typography variant="caption" color="text.secondary">
                        یادداشت شما: {report.customText}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Scaffold>
  );
}
