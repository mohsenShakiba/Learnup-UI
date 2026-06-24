import {
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { EpubNavItem } from '../../../services/BookManagarService';

interface Props {
  toc: EpubNavItem[];
  onNavigate: (href: string) => void;
}

function TocItem ({
  item,
  onNavigate,
  depth = 0,
}: {
  item: EpubNavItem;
  onNavigate: (href: string) => void;
  depth?: number;
}) {
  return (
    <>
      <ListItem disablePadding >
        <ListItemButton sx={{ pl: 2 + depth * 2 }} onClick={() => onNavigate(item.href)}>
          <ListItemText sx={{ direction: 'rtl', textAlign: 'right' }}
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

export function TableOfContentsDrawer ({ toc, onNavigate }: Props) {
  const handleNavigate = (href: string) => {
    onNavigate(href);
  };

  return (
    <List dense sx={{ direction: 'rtl' }}>
      {toc.map((item) => (
        <TocItem key={item.id} item={item} onNavigate={handleNavigate} />
      ))}
    </List>
  );
}
