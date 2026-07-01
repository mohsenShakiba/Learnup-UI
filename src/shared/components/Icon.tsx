import type { SvgIconProps } from '@mui/material';
import type { ComponentType } from 'react';

import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import Add from '@mui/icons-material/AddOutlined';
import ArrowBack from '@mui/icons-material/ArrowBackOutlined';
import ArrowForward from '@mui/icons-material/ArrowForwardOutlined';
import AutoStories from '@mui/icons-material/AutoStoriesOutlined';
import BookmarkBorder from '@mui/icons-material/BookmarkBorderOutlined';
import Bookmark from '@mui/icons-material/BookmarkOutlined';
import ChatBubble from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CheckCircle from '@mui/icons-material/CheckCircleOutlined';
import Check from '@mui/icons-material/CheckOutlined';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/CloseOutlined';
import ClosedCaption from '@mui/icons-material/ClosedCaptionOutlined';
import DarkMode from '@mui/icons-material/DarkModeOutlined';
import Dashboard from '@mui/icons-material/DashboardOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import HourglassEmpty from '@mui/icons-material/HourglassEmptyOutlined';
import Layers from '@mui/icons-material/LayersOutlined';
import LightMode from '@mui/icons-material/LightModeOutlined';
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartmentOutlined';
import Logout from '@mui/icons-material/LogoutOutlined';
import MenuBook from '@mui/icons-material/MenuBookOutlined';
import Menu from '@mui/icons-material/MenuOutlined';
import MicNone from '@mui/icons-material/MicNoneOutlined';
import Mic from '@mui/icons-material/MicOutlined';
import MoreHoriz from '@mui/icons-material/MoreHorizOutlined';
import Notes from '@mui/icons-material/NotesOutlined';
import Pause from '@mui/icons-material/PauseOutlined';
import PersonAdd from '@mui/icons-material/PersonAddOutlined';
import PlayArrow from '@mui/icons-material/PlayArrowOutlined';
import Quiz from '@mui/icons-material/QuizOutlined';
import RemoveCircle from '@mui/icons-material/RemoveCircleOutlined';
import School from '@mui/icons-material/SchoolOutlined';
import Search from '@mui/icons-material/SearchOutlined';
import SentimentDissatisfied from '@mui/icons-material/SentimentDissatisfiedOutlined';
import Settings from '@mui/icons-material/SettingsOutlined';
import Speed from '@mui/icons-material/SpeedOutlined';
import Spellcheck from '@mui/icons-material/SpellcheckOutlined';
import Timer from '@mui/icons-material/TimerOutlined';
import Translate from '@mui/icons-material/TranslateOutlined';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import VolumeUp from '@mui/icons-material/VolumeUpOutlined';
import WorkspacePremium from '@mui/icons-material/WorkspacePremiumOutlined';

// Registry of every icon the app renders, keyed by the Material Symbols name that
// used to be passed as the ligature child of MUI's <Icon>. Only components listed
// here are bundled, so the icon set is tree-shaken instead of shipping a ~4 MB
// font. Add a new entry (name -> `@mui/icons-material/<Name>Outlined`) when you
// need a new icon; `IconName` below then flags any typo'd usage at build time.
const ICONS = {
  account_circle: AccountCircle,
  add: Add,
  arrow_back: ArrowBack,
  arrow_backward: ArrowBack,
  arrow_forward: ArrowForward,
  auto_stories: AutoStories,
  bookmark: Bookmark,
  bookmark_border: BookmarkBorder,
  chat_bubble: ChatBubble,
  check: Check,
  check_circle: CheckCircle,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  close: Close,
  closed_caption: ClosedCaption,
  dark_mode: DarkMode,
  dashboard: Dashboard,
  edit: Edit,
  hourglass: HourglassEmpty,
  layers: Layers,
  light_mode: LightMode,
  local_fire_department: LocalFireDepartment,
  logout: Logout,
  menu: Menu,
  menu_book: MenuBook,
  mic: Mic,
  mic_none: MicNone,
  more_horiz: MoreHoriz,
  notes: Notes,
  pause: Pause,
  person_add: PersonAdd,
  play_arrow: PlayArrow,
  quiz: Quiz,
  remove_circle: RemoveCircle,
  school: School,
  search: Search,
  sentiment_dissatisfied: SentimentDissatisfied,
  settings: Settings,
  speed: Speed,
  spellcheck: Spellcheck,
  timer: Timer,
  translate: Translate,
  upload_file: UploadFile,
  volume_up: VolumeUp,
  workspace_premium: WorkspacePremium,
} satisfies Record<string, ComponentType<SvgIconProps>>;

export type IconName = keyof typeof ICONS;

export type IconProps = Omit<SvgIconProps, 'children'> & {
  /**
   * Material Symbols name, e.g. `menu_book`. Registry names autocomplete; a plain
   * `string` is also accepted so names computed at runtime (`tab.icon`, etc.) work.
   * An unregistered name renders nothing (and warns in dev).
   */
  children: IconName | (string & {});
};

/**
 * Drop-in replacement for MUI's `<Icon>{name}</Icon>` ligature component, backed
 * by tree-shaken `@mui/icons-material` SVGs instead of the icon font. All SvgIcon
 * props (`sx`, `color`, `fontSize`, …) are forwarded unchanged.
 */
export function Icon ({ children, ...props }: IconProps) {
  const Component = ICONS[children as IconName] as
    | ComponentType<SvgIconProps>
    | undefined;
  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[Icon] unknown icon name: "${children}" — add it to Icon.tsx`);
    }
    return null;
  }
  return <Component {...props} />;
}
