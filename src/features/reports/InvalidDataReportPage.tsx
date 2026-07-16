import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReportSectionForm } from "./components/ReportSectionForm";
import {
  createEmptyReportValues,
  getSectionHelperText,
  isReportFormValid,
  type ReportFormValues,
} from "./reportFieldConfig";
import { DefaultHeader } from "../../shared/components/DefaultHeader";
import { FancyButton } from "../../shared/components/FancyButton";
import { Scaffold } from "../../shared/components/Scaffold";
import { toast } from "../../shared/toast";
import {
  errorKinds,
  saveInvalidDataReport,
  sectionConfigs,
  type ErrorKind,
  type ReportSection,
} from "./reportStorage";

function buildReportDetails(values: ReportFormValues) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value.trim().length > 0),
  );
}

export default function InvalidDataReportPage() {
  const navigate = useNavigate();
  const [errorKind, setErrorKind] = useState<ErrorKind>("data-error");
  const [section, setSection] = useState<ReportSection>("courses");
  const [formValues, setFormValues] = useState(createEmptyReportValues);

  const currentSection = sectionConfigs[section];
  const helperText = getSectionHelperText(errorKind, section);
  const canSubmit = isReportFormValid(errorKind, section, formValues);

  const handleErrorKindChange = (nextErrorKind: ErrorKind) => {
    setErrorKind(nextErrorKind);
    setFormValues(createEmptyReportValues());
  };

  const handleSectionChange = (nextSection: ReportSection) => {
    setSection(nextSection);
    setFormValues(createEmptyReportValues());
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("لطفا همه فیلدهای این بخش را کامل کنید.");
      return;
    }

    const details = buildReportDetails(formValues);
    const payload = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      errorKind,
      section,
      sectionLabel: currentSection.label,
      details,
      isCurrentPage: false,
      customText: "",
      status: "pending" as const,
    };

    saveInvalidDataReport(payload);
    toast.success("گزارش شما ثبت شد.");
    setFormValues(createEmptyReportValues());
  };

  return (
    <Scaffold
      disableBottomPadding
      header={<DefaultHeader header="گزارش خطا" />}
    >
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              اگر در هر بخشی از برنامه خطا یا داده نادرست دیدید، از این فرم برای
              ارسال گزارش استفاده کنید.
            </Typography>
          </Box>
          <Button onClick={() => navigate("/report/invalid-data/list")}>
            لیست گزارش ها
          </Button>
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>چه نوع خطایی مشاهده کردید؟</FormLabel>
              <RadioGroup
                value={errorKind}
                onChange={(event) =>
                  handleErrorKindChange(event.target.value as ErrorKind)
                }
                sx={{ gap: 2, paddingTop: 2 }}
              >
                {errorKinds.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl>
              <InputLabel>کجا این مشکل را دیده اید؟</InputLabel>
              <Select
                label="کجا این مشکل را دیده اید؟"
                value={section}
                onChange={(event) =>
                  handleSectionChange(event.target.value as ReportSection)
                }
              >
                {Object.entries(sectionConfigs).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 1 }}
              >
                <Typography variant="subtitle2">
                  فیلدهای مربوط به این بخش
                </Typography>
                <Chip size="small" label={currentSection.label} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {helperText}
              </Typography>
            </Box>

            <ReportSectionForm
              key={`${errorKind}-${section}`}
              errorKind={errorKind}
              section={section}
              values={formValues}
              onChange={setFormValues}
            />

            <FancyButton onClick={handleSubmit} disabled={!canSubmit}>
              ثبت گزارش
            </FancyButton>
          </Stack>
        </Paper>
      </Stack>
    </Scaffold>
  );
}
