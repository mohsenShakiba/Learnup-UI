import { Box, Link, Typography } from "@mui/material";
import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownMessageProps = {
  content: string;
};

// Renders assistant replies as basic Markdown (bold, italics, lists, code,
// links, headings…) while keeping the visual language of the surrounding
// MUI theme. Kept intentionally minimal — no raw HTML is allowed through.
export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <Box
      sx={{
        lineHeight: 1.7,
        wordBreak: "break-word",
        "& > *:first-of-type": { mt: 0 },
        "& > *:last-child": { mb: 0 },
        "& p": { my: 0.75 },
        "& ul, & ol": { my: 0.75, pl: 3 },
        "& li": { my: 0.25 },
        "& li > p": { my: 0 },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          my: 1,
          fontWeight: 700,
          lineHeight: 1.4,
        },
        "& blockquote": {
          my: 0.75,
          ps: 1.5,
          borderInlineStart: "3px solid",
          borderColor: "divider",
          color: "text.secondary",
        },
        "& code": {
          fontFamily: "monospace",
          fontSize: "0.85em",
          px: 0.5,
          py: 0.125,
          borderRadius: 1,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
        "& pre": {
          my: 0.75,
          p: 1.25,
          borderRadius: 2,
          overflowX: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          direction: "ltr",
          textAlign: "left",
        },
        "& pre code": {
          p: 0,
          backgroundColor: "transparent",
        },
        "& table": {
          my: 0.75,
          borderCollapse: "collapse",
          width: "100%",
        },
        "& th, & td": {
          border: "1px solid",
          borderColor: "divider",
          px: 1,
          py: 0.5,
        },
        "& hr": {
          my: 1,
          border: "none",
          borderTop: "1px solid",
          borderColor: "divider",
        },
        "& img": { maxWidth: "100%" },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => (
            <Typography variant="body2" component="p" {...props} />
          ),
          li: ({ node, ...props }) => (
            <Typography variant="body2" component="li" {...props} />
          ),
          a: ({ ...props }: ComponentProps<typeof Link>) => (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
