import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { HTMLTag, type GrammarLessonResponse } from "../../../api/Learnup";

type GrammarContentRendererProps = {
  lessons: GrammarLessonResponse[];
};

export function GrammarContentRenderer({
  lessons,
}: GrammarContentRendererProps) {
  const theme = useTheme();
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  const sections: { title: string; lessons: GrammarLessonResponse[] }[] = [];

  sortedLessons.forEach((lesson) => {
    const title = lesson.title?.trim() ?? "";
    const lastSection = sections[sections.length - 1];

    if (title && lastSection?.title === title) {
      lastSection.lessons.push(lesson);
      return;
    }

    sections.push({
      title,
      lessons: [lesson],
    });
  });

  return (
    <Box
      component="article"
      sx={{
        maxWidth: 760,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        borderRadius: 4,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 18px 40px ${alpha(theme.palette.common.black, 0.24)}`
            : `0 18px 40px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
    >
      {sections.map((section, sectionIndex) => (
        <Box
          key={`${section.title || "section"}-${sectionIndex}`}
          sx={{
            mb: sectionIndex === sections.length - 1 ? 0 : 4,
            pb: 1,
          }}
        >
          {section.lessons.map((lesson, lessonIndex) => {
            const isRtl = lesson.language === "fa";
            const isExample = lesson.language === "en";
            const direction = isRtl ? "rtl" : "ltr";
            const align = isRtl ? "right" : "left";

            const exampleBoxSx = isExample
              ? {
                  px: 2,
                  py: 1.5,
                  borderRadius: 2.5,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.info.light, 0.14)
                      : alpha(theme.palette.info.main, 0.08),
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.info.light, 0.32)
                      : alpha(theme.palette.info.main, 0.18),
                }
              : undefined;

            const noteBoxSx =
              lesson.htmlTag === HTMLTag.BLOCKQUOTE || lesson.htmlTag === HTMLTag.STRONG
                ? {
                    px: 2,
                    py: 1.25,
                    borderRadius: 2,
                    borderLeft: isRtl ? "none" : "4px solid",
                    borderRight: isRtl ? "4px solid" : "none",
                    borderColor:
                      lesson.htmlTag === HTMLTag.STRONG
                        ? theme.palette.warning.main
                        : theme.palette.primary.main,
                    bgcolor:
                      lesson.htmlTag === HTMLTag.STRONG
                        ? alpha(theme.palette.warning.main, 0.08)
                        : alpha(theme.palette.primary.main, 0.07),
                  }
                : undefined;

            const spacingSx = {
              direction,
              textAlign: align,
              mt:
                lesson.htmlTag === HTMLTag.HEADING1 ||
                lesson.htmlTag === HTMLTag.HEADING2
                  ? lessonIndex === 0
                    ? 0
                    : 4
                  : lesson.htmlTag === HTMLTag.HEADING3
                    ? 3
                    : 0,
              mb: 2,
            } as const;

            if (lesson.htmlTag === HTMLTag.HEADING1) {
              return (
                <Box
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    pb: 1,
                    borderBottom: "2px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.35),
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ direction, textAlign: align, fontWeight: 800 }}
                  >
                    {lesson.content}
                  </Typography>
                </Box>
              );
            }

            if (lesson.htmlTag === HTMLTag.HEADING2) {
              return (
                <Box
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    pl: isRtl ? 0 : 1.5,
                    pr: isRtl ? 1.5 : 0,
                    borderLeft: isRtl ? "none" : "4px solid",
                    borderRight: isRtl ? "4px solid" : "none",
                    borderColor: alpha(theme.palette.secondary.main, 0.5),
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ direction, textAlign: align, fontWeight: 700 }}
                  >
                    {lesson.content}
                  </Typography>
                </Box>
              );
            }

            if (lesson.htmlTag === HTMLTag.HEADING3) {
              return (
                <Typography
                  key={lesson.id}
                  variant="h6"
                  sx={{
                    ...spacingSx,
                    color: "text.primary",
                    fontWeight: 700,
                  }}
                >
                  {lesson.content}
                </Typography>
              );
            }

            if (
              lesson.htmlTag === HTMLTag.HEADING4 ||
              lesson.htmlTag === HTMLTag.HEADING5
            ) {
              return (
                <Typography
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    letterSpacing: 0.2,
                    color: "text.secondary",
                  }}
                >
                  {lesson.content}
                </Typography>
              );
            }

            if (lesson.htmlTag === HTMLTag.HORIZONTAL_RULE) {
              return (
                <Box
                  key={lesson.id}
                  component="hr"
                  sx={{
                    my: 3,
                    border: 0,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                />
              );
            }

            if (lesson.htmlTag === HTMLTag.FIGURE) {
              return (
                <Box
                  key={lesson.id}
                  component="img"
                  src={lesson.content}
                  alt={lesson.title || "grammar"}
                  sx={{
                    display: "block",
                    width: "100%",
                    mb: 1.5,
                    borderRadius: 2,
                  }}
                />
              );
            }

            if (lesson.htmlTag === HTMLTag.FIGCAPTION) {
              return (
                <Typography
                  key={lesson.id}
                  variant="caption"
                  sx={{
                    ...spacingSx,
                    display: "block",
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {lesson.content}
                </Typography>
              );
            }

            if (
              lesson.htmlTag === HTMLTag.PREFORMATTED ||
              lesson.htmlTag === HTMLTag.CODE
            ) {
              return (
                <Box
                  key={lesson.id}
                  component="pre"
                  sx={{
                    ...spacingSx,
                    ...exampleBoxSx,
                    mt: 0,
                    p: 2,
                    overflowX: "auto",
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.black, 0.26)
                        : alpha(theme.palette.common.black, 0.04),
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {isExample && (
                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        mb: 1,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "text.secondary",
                      }}
                    >
                      Example
                    </Typography>
                  )}
                  {lesson.content}
                </Box>
              );
            }

            if (
              lesson.htmlTag === HTMLTag.UNORDERED_LIST ||
              lesson.htmlTag === HTMLTag.ORDERED_LIST ||
              lesson.htmlTag === HTMLTag.LIST_ITEM
            ) {
              const listTag =
                lesson.htmlTag === HTMLTag.ORDERED_LIST ? "ol" : "ul";

              return (
                <Box
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    ...exampleBoxSx,
                  }}
                >
                  {isExample && (
                    <Typography
                      sx={{
                        mb: 1,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "text.secondary",
                      }}
                    >
                      Example
                    </Typography>
                  )}
                  <Box
                    component={listTag}
                    sx={{
                      m: 0,
                      pl: isRtl ? 0 : 3,
                      pr: isRtl ? 3 : 0,
                      "& li": {
                        mb: 1.1,
                      },
                      "& li:last-child": {
                        mb: 0,
                      },
                    }}
                  >
                    <li>
                      <Typography
                        sx={{
                          direction,
                          textAlign: isExample ? align : "justify",
                          lineHeight: 1.9,
                        }}
                      >
                        {lesson.content}
                      </Typography>
                    </li>
                  </Box>
                </Box>
              );
            }

            if (lesson.htmlTag === HTMLTag.TABLE) {
              return (
                <Box
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    ...exampleBoxSx,
                    p: 2,
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.info.light, 0.1)
                        : alpha(theme.palette.info.main, 0.05),
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {isExample && (
                    <Typography
                      sx={{
                        mb: 1,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "text.secondary",
                      }}
                    >
                      Example
                    </Typography>
                  )}
                  {lesson.content}
                </Box>
              );
            }

            if (
              lesson.htmlTag === HTMLTag.BLOCKQUOTE ||
              lesson.htmlTag === HTMLTag.STRONG
            ) {
              return (
                <Box
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    ...noteBoxSx,
                  }}
                >
                  <Typography
                    sx={{
                      mb: 0.75,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    {lesson.htmlTag === HTMLTag.STRONG ? "Rule" : "Note"}
                  </Typography>
                  <Typography
                    sx={{
                      direction,
                      textAlign: lesson.htmlTag === HTMLTag.STRONG ? align : "justify",
                      lineHeight: 1.9,
                      fontWeight: lesson.htmlTag === HTMLTag.STRONG ? 700 : 400,
                    }}
                  >
                    {lesson.content}
                  </Typography>
                </Box>
              );
            }

            if (lesson.htmlTag === HTMLTag.EMPHASIS) {
              return (
                <Typography
                  key={lesson.id}
                  sx={{
                    ...spacingSx,
                    ...exampleBoxSx,
                    fontStyle: "italic",
                    color: "text.secondary",
                  }}
                >
                  {lesson.content}
                </Typography>
              );
            }

            return (
              <Box
                key={lesson.id}
                sx={{
                  ...spacingSx,
                  ...exampleBoxSx,
                }}
              >
                {isExample && (
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    Example
                  </Typography>
                )}
                <Typography
                  component="p"
                  sx={{
                    m: 0,
                    direction,
                    textAlign: isExample ? align : "justify",
                    lineHeight: 1.95,
                    whiteSpace: "pre-wrap",
                    color: "text.primary",
                  }}
                >
                  {lesson.content}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
