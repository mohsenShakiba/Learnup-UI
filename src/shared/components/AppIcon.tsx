import type { SvgIconProps } from '@mui/material';
import type { ComponentType } from 'react';

import PlayCircle from '@mui/icons-material/PlayCircleOutlineRounded';
import PauseCircle from '@mui/icons-material/PauseCircleOutlined';
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRightOutlined';
import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import AcUnit from '@mui/icons-material/AcUnitOutlined';
import Add from '@mui/icons-material/AddOutlined';
import ArrowBack from '@mui/icons-material/ArrowBackOutlined';
import ArrowForward from '@mui/icons-material/ArrowForwardOutlined';
import Bolt from '@mui/icons-material/BoltOutlined';
import BookmarkBorder from '@mui/icons-material/BookmarkBorderOutlined';
import Bookmark from '@mui/icons-material/BookmarkOutlined';
import ChatBubble from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CheckCircle from '@mui/icons-material/CheckCircleOutlined';
import Check from '@mui/icons-material/CheckOutlined';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ClosedCaption from '@mui/icons-material/ClosedCaptionOutlined';
import Close from '@mui/icons-material/CloseOutlined';
import DarkMode from '@mui/icons-material/DarkModeOutlined';
import Dashboard from '@mui/icons-material/DashboardOutlined';
import Delete from '@mui/icons-material/DeleteOutlined';
import Done from '@mui/icons-material/Done';
import Edit from '@mui/icons-material/EditOutlined';
import Forum from '@mui/icons-material/ForumOutlined';
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
import MoreVert from '@mui/icons-material/MoreVertOutlined';
import Notes from '@mui/icons-material/NotesOutlined';
import Pause from '@mui/icons-material/PauseOutlined';
import PersonAdd from '@mui/icons-material/PersonAddOutlined';
import PlayArrow from '@mui/icons-material/PlayArrowOutlined';
import Quiz from '@mui/icons-material/QuizOutlined';
import RemoveCircle from '@mui/icons-material/RemoveCircleOutlined';
import Replay from '@mui/icons-material/ReplayOutlined';
import RocketLaunch from '@mui/icons-material/RocketLaunchOutlined';
import Schedule from '@mui/icons-material/ScheduleOutlined';
import School from '@mui/icons-material/SchoolOutlined';
import Search from '@mui/icons-material/SearchOutlined';
import Send from '@mui/icons-material/SendOutlined';
import SentimentDissatisfied from '@mui/icons-material/SentimentDissatisfiedOutlined';
import Settings from '@mui/icons-material/SettingsOutlined';
import Speed from '@mui/icons-material/SpeedOutlined';
import Spellcheck from '@mui/icons-material/SpellcheckOutlined';
import Timer from '@mui/icons-material/TimerOutlined';
import Translate from '@mui/icons-material/TranslateOutlined';
import TrendingDown from '@mui/icons-material/TrendingDownOutlined';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import VolumeUp from '@mui/icons-material/VolumeUpOutlined';
import WorkspacePremium from '@mui/icons-material/WorkspacePremiumOutlined';
import BrigtnessAuto from '@mui/icons-material/BrightnessAutoOutlined';
import ArrowUpward from '@mui/icons-material/ArrowUpwardOutlined';

// Registry of every icon the app renders, keyed by the Material Symbols name that
// used to be passed as the ligature child of MUI's <Icon>. Only components listed
// here are bundled, so the icon set is tree-shaken instead of shipping a ~4 MB
// font. Add a new entry (name -> `@mui/icons-material/<Name>Outlined`) when you
// need a new icon; `IconName` below then flags any typo'd usage at build time.
const ICONS = {
  account_circle: AccountCircle,
  ac_unit: AcUnit,
  add: Add,
  arrow_back: ArrowBack,
  arrow_backward: ArrowBack,
  arrow_forward: ArrowForward,
  bolt: Bolt,
  book_ribbon: MenuBook,
  bookmark: Bookmark,
  bookmark_border: BookmarkBorder,
  chat_bubble: ChatBubble,
  check: Check,
  check_circle: CheckCircle,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  close: Close,
  closed_caption: ClosedCaption,
  conversation: Forum,
  dark_mode: DarkMode,
  dashboard: Dashboard,
  delete: Delete,
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
  more_vert: MoreVert,
  notes: Notes,
  pause: Pause,
  person_add: PersonAdd,
  play_arrow: PlayArrow,
  quiz: Quiz,
  remove_circle: RemoveCircle,
  replay: Replay,
  rocket_launch: RocketLaunch,
  schedule: Schedule,
  school: School,
  search: Search,
  send: Send,
  sentiment_dissatisfied: SentimentDissatisfied,
  settings: Settings,
  speed: Speed,
  spellcheck: Spellcheck,
  timer: Timer,
  translate: Translate,
  trending_down: TrendingDown,
  upload_file: UploadFile,
  volume_up: VolumeUp,
  workspace_premium: WorkspacePremium,
  done: Done,
  brightness_auto: BrigtnessAuto,
  play_circle: PlayCircle,
  pause_circle: PauseCircle,
  arrow_circle_left: ArrowCircleLeft,
  arrow_circle_right: ArrowCircleRight,
  arrow_upward: ArrowUpward,
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
export function AppIcon ({ children, ...props }: IconProps) {
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
