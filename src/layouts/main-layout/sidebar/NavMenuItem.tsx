import {
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { IMenuitems } from './MenuItems';
import { useLocation, Link as RouterLink } from 'react-router-dom';

interface NavMenuItemType {
  item: IMenuitems;
  pathTo: string;
  onItemClick?: () => void;
}

const NavMenuItem = ({ item, onItemClick }: NavMenuItemType) => {
  const location = useLocation();
  const { icon: Icon } = item;
  const itemIcon = Icon ? <Icon /> : null;
  const isAvailable = item?.available;

  const isSelected =
    location.pathname === item?.href ||
    location.pathname.startsWith(item?.href + '/') ||
    (item?.href === '/projects' && location.pathname.startsWith('/projects')) ||
    (item?.href === '/clients' && location.pathname.startsWith('/clients')) ||
    (item?.href === '/projects' && location.pathname.startsWith('/clients')) ||
    (item?.href === '/clients' && location.pathname.startsWith('/projects'));

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      {isAvailable ? (
        <RouterLink to={item?.href || '/'} style={{ textDecoration: 'none' }}>
          <ListItemButton
            selected={isSelected}
            onClick={() => {
              onItemClick?.(); // solo cierra el Drawer
            }}
            sx={{
              pointerEvents: 'auto',
              '&:hover': {
                backgroundColor: undefined,
                opacity: 1,
              },
            }}
          >
            <ListItemIcon sx={{ py: 0.4, px: 0 }}>
              {itemIcon}
            </ListItemIcon>
            <ListItemText>
              <>{item?.title}</>
              <br />
              {item?.subtitle && (
                <Typography variant="caption">{item.subtitle}</Typography>
              )}
            </ListItemText>

            {item?.chip && (
              <Chip
                color={item.chipColor}
                variant={item.variant || 'outlined'}
                size="small"
                label={item.chip}
                sx={({ palette, shape, typography }) => ({
                  borderRadius: shape.borderRadius * 3,
                  ...typography.caption,
                  ...(isSelected
                    ? {
                        bgcolor: palette.text.disabled,
                        color: palette.primary.main,
                      }
                    : {
                        bgcolor: palette.text.primary,
                        color: palette.common.white,
                      }),
                })}
              />
            )}
          </ListItemButton>
        </RouterLink>
      ) : (
        <ListItemButton
          selected={isSelected}
          sx={{
            pointerEvents: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              opacity: 0.7,
            },
          }}
        >
          <ListItemIcon
            sx={{
              py: 0.4,
              px: 0,
              color: 'action.active',
            }}
          >
            {itemIcon}
          </ListItemIcon>
          <ListItemText sx={{ color: 'action.active' }}>
            <>{item?.title}</>
            <br />
            {item?.subtitle && (
              <Typography variant="caption">{item.subtitle}</Typography>
            )}
          </ListItemText>

          {item?.chip && (
            <Chip
              color={item.chipColor}
              variant={item.variant || 'outlined'}
              size="small"
              label={item.chip}
              sx={({ palette, shape, typography }) => ({
                borderRadius: shape.borderRadius * 3,
                ...typography.caption,
                ...(isSelected
                  ? {
                      bgcolor: palette.text.disabled,
                      color: palette.primary.main,
                    }
                  : {
                      bgcolor: palette.text.primary,
                      color: palette.common.white,
                    }),
              })}
            />
          )}
        </ListItemButton>
      )}
    </List>
  );
};

export default NavMenuItem;
