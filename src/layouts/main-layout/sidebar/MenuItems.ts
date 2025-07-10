/* eslint-disable @typescript-eslint/no-explicit-any */
import GlobalSettingsIcon from 'components/icons/menu-icons/GlobalSettingsIcon';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import PersonalSettingsIcon from 'components/icons/menu-icons/PersonalSettingsIcon';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpIcon from '@mui/icons-material/Help'; // Importar el icono de ayuda
import { uniqueId } from 'lodash';
import { useUsers } from 'providers/UsersProvider';
import { useIntl } from 'react-intl';


export interface IMenuitems {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: React.ElementType;
  href?: string;
  children?: IMenuitems[];
  chip?: string;
  chipColor?: string | any;
  variant?: string | any;
  available?: boolean;
  level?: number;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
}

const Menuitems= (currentUser:any): IMenuitems[]  => {
  const userId = currentUser?.id || '';
  const { formatMessage } = useIntl(); // Usamos useIntl para acceder a las funciones de traducción

  return [
  {
    id: uniqueId(),
    title: 'Agency',
    icon: HomeIcon,
    href: '/',
    available: true,
  },
  {
    id: uniqueId(),
    title: formatMessage({ id: 'projectsClients' }), // Traducir el título
    icon: AssignmentIcon,
    href: '/projects',
    available: true,
  },
  // {
  //   id: uniqueId(),
  //   title: 'Ranking',
  //   icon: EmojiEventsIcon,
  //   // href: '/ranking',
  //   available: false,
  // },
  {
    id: uniqueId(),
    title: formatMessage({ id: 'socialMedia' }), // Traducir el título
    icon: InstagramIcon, // Aquí usamos directamente el icono importado
    // href: '/instagram',
    chip: '',
    chipColor: 'secondary',
    available: false,
  },
  {
    id: uniqueId(),
    title: 'CalendaryX',
    icon: CalendarMonthIcon,
    href: '/calendar',
    available: true,
  },
  // {
    //   id: uniqueId(),
    //   title: 'Websites',
    //   icon: LanguageIcon,
    //   // href: '/websites',
    //   available: false,
    // },
    {
      id: uniqueId(),
      title: 'CEOX',
      icon: LanguageIcon,
      href: '/ceox',
      available: true,
    },
    // {
  //   id: uniqueId(),
  //   title: 'TikTok',
  //   icon: MusicNoteIcon,
  //   // href: '/tiktok',
  //   available: false,
  {
    id: uniqueId(),
    title: 'PomodoroX',
    icon: AvTimerIcon,
    href: '/pomodoro',
    available: true,
  },
  
  {
    navlabel: true,
    subheader: 'Settings',
  },
  {
    id: uniqueId(),
    title: formatMessage({ id: 'myProfile' }), // Traducir el título
    icon: PersonalSettingsIcon,
    href: `/user-settings/${userId}`, // Usa el encadenamiento opcional
    available: true,
  },
  {
    id: uniqueId(),
    title: formatMessage({ id: 'settings' }), // Traducir el título
    icon: GlobalSettingsIcon,
    href: '/global-settings/',
    available: true,
  },
  {
    id: uniqueId(),
    title: formatMessage({ id: 'help' }),
    icon: HelpIcon, // Replace with a valid React component
     href: '/help',
    available: true,
  },
]
};

export default Menuitems;
