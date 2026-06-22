import { Box, CircularProgress, Icon, IconButton, Popover, Stack, Typography } from '@mui/material';
import Epub, { Book, Rendition } from 'epubjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiService } from '../../../api/Learnup/services/AiService';
import { DEFAULT_CONFIG, NavItem, ReaderConfig, THEMES } from '../readerTypes';
import { ReaderConfigDrawer } from './ReaderConfigDrawer';
import { TableOfContentsDrawer } from './TableOfContentsDrawer';

interface Props {
  bookData: ArrayBuffer;
}

export function ReaderComponent ({ bookData }: Props) {
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_CONFIG);
  const [toc, setToc] = useState<NavItem[]>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [pageInfo, setPageInfo] = useState({ page: 0, total: 0 });
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; } | null>(null);
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const tocRef = useRef<NavItem[]>([]);
  const configRef = useRef(config);
  const highlightedCfi = useRef<string | null>(null);

  useEffect(() => { tocRef.current = toc; }, [toc]);
  useEffect(() => { configRef.current = config; }, [config]);

  const buildThemeStyles = (cfg: ReaderConfig) => {
    const theme = THEMES[cfg.theme];
    return {
      body: {
        color: `${theme.color} !important`,
        background: `${theme.bg} !important`,
        'font-size': `${cfg.fontSize}px !important`,
        'line-height': `${cfg.lineSpacing} !important`,
        'font-family': cfg.fontFamily === 'Default' ? 'inherit' : `${cfg.fontFamily} !important`,
        padding: `8px ${cfg.padding}px !important`,
      },
      '::selection': { background: 'rgba(170, 38, 99, 0.3)' },
      '.epubjs-hl': { fill: 'rgb(46, 103, 189)', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply' },
    };
  };

  useEffect(() => {
    if (!viewerRef.current || !bookData) return;

    const book = Epub(bookData);
    bookRef.current = book;

    const rendition = book.renderTo(viewerRef.current, {
      manager: 'continuous',
      flow: 'paginated',
      width: '100%',
      height: '100%',
      snap: true,
    });
    renditionRef.current = rendition;

    book.loaded.navigation.then((nav) => {
      setToc(nav.toc as NavItem[]);
      tocRef.current = nav.toc as NavItem[];
    });

    rendition.on('relocated', (location: any) => {
      setAtStart(location.atStart);
      setAtEnd(location.atEnd);
      const p = location.start?.displayed;
      if (p) setPageInfo({ page: p.page, total: p.total });

      const href: string = location.start?.href ?? '';
      const find = (items: NavItem[]): string => {
        for (const it of items) {
          const base = it.href.split('#')[0];
          if (href.endsWith(base) || base.endsWith(href)) return it.label;
          if (it.subitems) { const r = find(it.subitems); if (r) return r; }
        }
        return '';
      };
      setChapter(find(tocRef.current));
    });

    rendition.hooks.content.register((contents: any) => {
      const doc: Document = contents.document;

      rendition.themes.default(buildThemeStyles(configRef.current));

      doc.addEventListener('click', (e: MouseEvent) => {
        if (highlightedCfi.current) {
          rendition.annotations.remove(highlightedCfi.current, 'highlight');
          highlightedCfi.current = null;
          setPopoverPos(null);
        }

        const caret = (doc as any).caretRangeFromPoint?.(e.clientX, e.clientY) as Range | null;
        if (!caret || caret.startContainer.nodeType !== Node.TEXT_NODE) return;

        const clickedNode = caret.startContainer as Text;

        let block: Element | null = clickedNode.parentElement;
        while (block && !['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TD', 'BLOCKQUOTE'].includes(block.tagName)) {
          block = block.parentElement;
        }
        if (!block) return;

        const textNodes: Text[] = [];
        const walker = doc.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) textNodes.push(n as Text);

        const clickedIdx = textNodes.indexOf(clickedNode);
        if (clickedIdx === -1) return;

        const charMap: { node: Text; offset: number; }[] = [];
        let fullText = '';
        for (const tn of textNodes) {
          const t = tn.textContent ?? '';
          for (let i = 0; i < t.length; i++) charMap.push({ node: tn, offset: i });
          fullText += t;
        }

        let pos = 0;
        for (let i = 0; i < clickedIdx; i++) pos += textNodes[i].textContent!.length;
        pos += caret.startOffset;
        if (pos >= charMap.length) pos = charMap.length - 1;

        let start = 0;
        for (let i = pos - 1; i >= 1; i--) {
          if (['.', '!', '?'].includes(fullText[i]) && fullText[i + 1] === ' ') {
            start = i + 2;
            break;
          }
        }

        let end = fullText.length - 1;
        for (let i = pos; i < fullText.length; i++) {
          if (['.', '!', '?'].includes(fullText[i])) {
            end = i;
            break;
          }
        }

        if (start > end || !charMap[start] || !charMap[end]) return;

        const range = doc.createRange();
        range.setStart(charMap[start].node, charMap[start].offset);
        range.setEnd(charMap[end].node, charMap[end].offset + 1);

        try {
          const cfi: string = contents.cfiFromRange(range);
          rendition.annotations.highlight(cfi, {}, undefined as any, 'epubjs-hl', { fill: 'rgb(54, 113, 171)', 'fill-opacity': '0.3' });
          highlightedCfi.current = cfi;

          const selectedText = range.toString().trim();
          const iframe = viewerRef.current?.querySelector('iframe');
          const iframeRect = iframe?.getBoundingClientRect();
          setPopoverPos({ top: (iframeRect?.top ?? 0) + e.clientY, left: (iframeRect?.left ?? 0) + e.clientX });
          setAiResult('');
          setAiLoading(true);
          AiService.postMobileAiSend(selectedText)
            .then((res) => { setAiResult(res); setAiLoading(false); })
            .catch(() => { setAiResult('Failed to get response.'); setAiLoading(false); });
        } catch {
          // Range crosses element boundaries — skip
        }
      });
    });

    rendition.display();

    return () => {
      rendition.destroy();
      book.destroy();
      bookRef.current = null;
      renditionRef.current = null;
    };
  }, [bookData]);

  useEffect(() => {
    renditionRef.current?.themes.default(buildThemeStyles(config));
  }, [config]);

  const updateConfig = useCallback((patch: Partial<ReaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const navigateToHref = useCallback((href: string) => {
    renditionRef.current?.display(href);
  }, []);

  const theme = THEMES[config.theme];

  return (
    <>
      <Stack>

        <Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>

            <Typography variant="h6" sx={{ color: theme.color }}>book</Typography>

            {chapter && (
              <Typography variant="caption" noWrap sx={{ color: theme.color, opacity: 0.6 }}>
                {chapter}
              </Typography>
            )}

          </Box>

          <IconButton onClick={() => setTocOpen(true)} size="small">
            <Icon>menu_book</Icon>
          </IconButton>
          <IconButton onClick={() => setConfigOpen(true)} size="small">
            <Icon>tune</Icon>
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <Box ref={viewerRef} sx={{ width: '100%', height: '100%' }} />
          {!bookData && (
            <Stack
              sx={{
                position: 'absolute',
                inset: 0,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.bg,
                gap: 1,
              }}
            >
              <CircularProgress size={28} />
            </Stack>
          )}
        </Box>

        <Stack direction="row" sx={{ px: 1, py: 0.5, borderTop: 1, borderColor: theme.border, alignItems: 'center' }}>
          <IconButton onClick={() => renditionRef.current?.prev()} size="large" disabled={atStart}>
            <span className="material-icons" style={{ color: theme.color }}>chevron_left</span>
          </IconButton>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {pageInfo.total > 1 && (
              <Typography variant="caption" sx={{ color: theme.color, opacity: 0.5 }}>
                {pageInfo.page} / {pageInfo.total}
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => renditionRef.current?.next()} size="large" disabled={atEnd}>
            <span className="material-icons" style={{ color: theme.color }}>chevron_right</span>
          </IconButton>
        </Stack>
      </Stack>

      <TableOfContentsDrawer
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        toc={toc}
        onNavigate={navigateToHref}
      />

      <ReaderConfigDrawer
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        config={config}
        onConfigChange={updateConfig}
      />

      <Popover
        open={!!popoverPos}
        onClose={() => setPopoverPos(null)}
        anchorReference="anchorPosition"
        anchorPosition={popoverPos ?? { top: 0, left: 0 }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, maxWidth: 320 }}>
          {aiLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography>{aiResult}</Typography>
          )}
        </Box>
      </Popover>
    </>
  );
}
