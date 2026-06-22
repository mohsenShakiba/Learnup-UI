import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { NavItem } from './readerTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  toc: NavItem[];
  onNavigate: (href: string) => void;
}

function TocItem({
  item,
  onNavigate,
  depth = 0,
}: {
  item: NavItem;
  onNavigate: (href: string) => void;
  depth?: number;
}) {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton sx={{ pl: 2 + depth * 2 }} onClick={() => onNavigate(item.href)}>
          <ListItemText
            primary={item.label.trim()}
          />
        </ListItemButton>
      </ListItem>
      {item.subitems?.map((sub) => (
        <TocItem key={sub.id} item={sub} onNavigate={onNavigate} depth={depth + 1} />
      ))}
    </>
  );
}

export function TableOfContentsDrawer({ open, onClose, toc, onNavigate }: Props) {
  const handleNavigate = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Contents
        </Typography>
        <IconButton onClick={onClose} size="small">
          <span className="material-icons">close</span>
        </IconButton>
      </Box>
      <Divider />
      {toc.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No table of contents available.
          </Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {toc.map((item) => (
            <TocItem key={item.id} item={item} onNavigate={handleNavigate} />
          ))}
        </List>
      )}
    </Drawer>
  );
}
