import {
  AppBar,
  Box,
  IconButton,
  Link,
  Stack,
  Toolbar,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/icons/brand/Logo';
import LanguageDropdown from 'layouts/main-layout/navbar/LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import paths from 'routes/path';
import MiniPomodoroTimer from './MiniPomodoroTimer';

interface MainNavbarProps {
  onDrawerToggle: () => void;
}

const orderedPaths = [
  paths.default,
  paths.projects,
  paths.archivedProjects,
  paths.projectDetails,
  paths.clientDetails,
  paths.ranking,
  paths.calendar,
  paths.websites,
  paths.pomodoro,
  paths.instagram,
  paths.tiktok,
  paths.reports,
  paths.personalSettings,
  paths.globalSettings,
];

const MainNavbar = ({ onDrawerToggle }: MainNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = orderedPaths.indexOf(location.pathname);

const handleReload = () => {
  // Borra todas las cachés
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName); // Borra cada caché
      });
    }).then(() => {
      // Actualiza el service worker si es necesario
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update(); // Fuerza la actualización del service worker
        });
      }
      
      // Luego, recarga la página
      window.location.reload();
    });
  }
};

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Stack direction="row" spacing={{ xs: 0, sm: 2 }} alignItems="center">
          {/* Logo con navegación controlada */}
          <Link
            component={RouterLink}
            to="/"
            sx={{
              overflow: 'hidden',
              display: { xs: 'flex', lg: 'none' },
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Logo sx={{ fontSize: 40, p: 1 }} />
          </Link>

          {/* Botón de menú para pantallas pequeñas */}
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={onDrawerToggle}
            sx={{
              display: { xs: 'block', lg: 'none' },
              width: 40,
              height: 42,
            }}
          >
            <IconifyIcon icon="oi:menu" color="primary.main" sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        <Box flexGrow={1} />
        <MiniPomodoroTimer />

        {/* Botón de recarga */}
        <IconButton
          onClick={handleReload}
          sx={{
            display: 'block',
            width: 40,
            height: 42,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            color: 'grey.600'
          }}
        >
          <IconifyIcon icon="mdi:reload" sx={{ fontSize: 24 }} />
        </IconButton>

        {/* Iconos adicionales */}
        <Stack spacing={0.5} direction="row" alignItems="center">
          <LanguageDropdown />
          <NotificationDropdown />
          <ProfileDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
