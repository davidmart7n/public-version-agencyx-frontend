import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { IProfileOptions } from 'data/navbar/menu-data';
import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { uniqueId } from 'lodash';
import { useUsers } from 'providers/UsersProvider'; // ✅ solo este hook
import { useIntl } from 'react-intl';

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [shouldCloseMenu, setShouldCloseMenu] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [delayedRender, setDelayedRender] = useState(false); // 🆕
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { currentUser, loadingCurrentUser } = useUsers(); // ✅ usamos este

  const handleNavigate = (href: string) => {
    setIsNavigating(true);
    navigate(href);
  };

  const closeMenu = () => {
    setShouldCloseMenu(true);
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
    navigate('/authentication/login');
  };

  const handleNavigateAndClose = (href: string) => {
    closeMenu();
    handleNavigate(href);
  };

  useEffect(() => {
    if (!loadingCurrentUser) {
      const timer = setTimeout(() => {
        setDelayedRender(true);
      }, 100); // puedes ajustar el delay si lo ves necesario

      return () => clearTimeout(timer);
    }
  }, [loadingCurrentUser]);

  useLayoutEffect(() => {
    if (shouldCloseMenu) {
      setAnchorEl(null);
      setShouldCloseMenu(false);
    }
  }, [shouldCloseMenu]);

  if (loadingCurrentUser || !currentUser?.fullName || !delayedRender) return null;

const intl = useIntl();

const profileOptions: IProfileOptions[] = [
  {
    id: uniqueId('1'),
    title: intl.formatMessage({ id: 'myProfile', defaultMessage: 'My Profile' }),
    icon: 'fa-regular:user',
    href: currentUser?.id ? `/user-settings/${currentUser.id}` : '#',
  },
  {
    id: uniqueId('2'),
    title: intl.formatMessage({ id: 'settings2', defaultMessage: 'Settings' }),
    icon: 'fa-solid:cog',
    href: '/global-settings/',
  },
  {
    id: uniqueId('3'),
    title: intl.formatMessage({ id: 'help', defaultMessage: 'Help' }),
    icon: 'fa-solid:question-circle',
    href: '/help',
  },
];

  return (
    <Box sx={{ px: 0.75, pr: 2 }}>
      <ButtonBase disableRipple onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Stack spacing={1.5} direction="row" alignItems="center" sx={{ py: 0.75, ml: 0.75 }}>
          <Avatar
            alt="User Avatar"
            variant="rounded"
            src={currentUser?.photoUrl}
            sx={{ height: 36, width: 36 }}
          />
          <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {currentUser?.fullName || 'Guest'}
          </Typography>
        </Stack>
      </ButtonBase>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            style: {
              paddingTop: '8px',
              width: '100%',
              maxWidth: 120,
            },
          },
        }}
      >
        {profileOptions.map((option) => (
          <MenuItem
            key={option.id}
            sx={{
              py: 0.75,
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              ...(option.disabled && {
                color: 'text.disabled',
                pointerEvents: 'none',
              }),
            }}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              if (!option.disabled) {
                handleNavigateAndClose(option.href);
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, mr: -1 }}>
              <IconifyIcon width={16} height={16} icon={option.icon} />
            </ListItemIcon>
            <Typography variant="subtitle2">{option.title}</Typography>
          </MenuItem>
        ))}
        <Stack direction="row" sx={{ width: 1, justifyContent: 'center' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{ mt: 1.5, width: '80%', py: 0.4 }}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              handleLogout();
            }}
          >
            Logout
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
};

export default ProfileDropdown;
