import { Badge, Box, Button, Chip, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import NotificationIcon from 'components/icons/NotificationIcon';
import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import SimpleBar from 'simplebar-react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate


// Interfaz para las notificaciones
interface NotificationData {
  id: string;
  title: string;
  subtitle: string;
  avatar: string;
  timestamp: string;
}

// Mapa de títulos a emojis
const titleToEmoji: { [key: string]: string } = {
  "¡Tarea completada!": "✅",
  "¡Proyecto Completado!": "🏆",
  "¡Nuevo Proyecto!": "🚀",
  "¡Nuevo Cliente!": "🤝",
  "¡Evento confirmado!": "📆",
  "¡Es hoy!": "🔥",
  "¡Nueva actualización!": "🔄"

};

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const open = Boolean(anchorEl);
  const db = getFirestore();
  const navigate = useNavigate(); // Instanciamos useNavigate


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Obtener las últimas 5 notificaciones desde Firestore en tiempo real
  useEffect(() => {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    // Configurar listener en tiempo real
    const unsubscribe = onSnapshot(notificationsQuery, (querySnapshot) => {
      const fetchedNotifications: NotificationData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          id: doc.id,
          title: data.title || 'Sin título',
          subtitle: data.body || 'Sin descripción',
          avatar: data.avatar || '',
          timestamp: data.timestamp || '',
        });
      });

      setNotifications(fetchedNotifications);

      // Contar las notificaciones no vistas
      const unreadNotifications = fetchedNotifications.filter((notification) => {
        const seen = localStorage.getItem(`notification_seen_${notification.id}`);
        return !seen;
      });

      setUnreadCount(unreadNotifications.length);
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      unsubscribe();
    };
  }, [db]);

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    // Guardar todas las notificaciones como vistas en localStorage
    notifications.forEach((notification) => {
      localStorage.setItem(`notification_seen_${notification.id}`, 'true');
    });

    // Actualizar el contador de notificaciones no vistas
    setUnreadCount(0); // Poner a 0 ya que todas son vistas
  };

  // Función para manejar el clic en "See All Notifications" o cualquier notificación
  const handleSeeAllNotifications = () => {
    markAllAsRead(); // Marcar todas las notificaciones como leídas
    handleClose(); // Cerrar el menú

    navigate('', { state: { fromNotifications: true } });
  };

  const handleNotificationClick = () => {
    markAllAsRead();
    handleClose();

    // Redirigir al Dashboard a la sección de Transactions
    navigate('', { state: { fromNotifications: true } });
  };


  return (
    <>
      <IconButton
        aria-label="Notifications"
        color="inherit"
        onClick={handleClick}
        sx={{
          color: 'grey.200',
        }}
      >
        <Badge color="primary" badgeContent={unreadCount}>
          <NotificationIcon />
        </Badge>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          sx: { flex: 1 },
        }}
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            style: {
              width: 326,
            },
          },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notificaciones</Typography>
          <Chip label={`${unreadCount} new`} color="primary" size="small" />
        </Stack>
        <SimpleBar style={{ height: '385px' }}>
          {notifications.map((notification) => {
            const emoji = titleToEmoji[notification.title] || '';
            return (
              <MenuItem
                key={notification.id}
                sx={{
                  py: 2,
                  px: 4,
                }}
                onClick={handleNotificationClick} // Redirigir a "Transactions" al hacer clic
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: 24,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {emoji}
                  </Typography>
                  <Box
                    sx={{
                      width: 200,
                    }}
                  >
                    <Typography mb={0.6} variant="subtitle2" color="textPrimary" fontWeight="medium" noWrap>
                      {notification.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle2" noWrap>
                      {notification.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            );
          })}
        </SimpleBar>
        <Stack direction="row" sx={{ width: 1, justifyContent: 'center' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              mt: -4,
              width: '80%',
            }}
            onClick={handleSeeAllNotifications}
          >
            See All Notifications
          </Button>
        </Stack>
      </Menu>
    </>
  );
};

export default NotificationDropdown;