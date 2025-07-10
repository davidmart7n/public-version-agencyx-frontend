import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { useDarkMode } from "providers/DarkModeProvider";
import { useIntlContext } from "providers/IntlProvider"; // Importamos el hook para el contexto de idioma
import { FormattedMessage, useIntl } from "react-intl";
import LoadingScreen from "components/loading/LoadingPage";
import Account from "components/sections/settings/Account";

const GlobalSettingsPage = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const { currentLanguage, toggleLanguage } = useIntlContext();
  const { formatMessage } = useIntl();
  const [notifications, setNotifications] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detecta si el dispositivo es móvil
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    setIsMobile(mobile);

    if (!mobile) {
      checkNotificationPermission();
    }
  }, []);

  const checkNotificationPermission = () => {
    if (Notification.permission === "granted") {
      setNotifications(true);
    } else if (Notification.permission === "denied") {
      setNotifications(false);
      setPermissionDenied(true);
    } else {
      setNotifications(false);
    }
  };

  const toggleNotificationPermission = async () => {
    if (!notifications && !permissionDenied) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
      } else {
        setNotifications(false);
        setPermissionDenied(true);
      }
    } else if (notifications) {
      setNotifications(false);
    }
  };

  const handleToggleDarkMode = () => {
    setLoading(true); // Activa la pantalla de carga antes de hacer el cambio

    // Cambia el tema
    toggleDarkMode();

    // Simulamos un retraso para mostrar el loading antes de recargar la página
    setTimeout(() => {
      window.location.reload(); // Recarga la página para aplicar el nuevo tema
    }, 500); // Ajusta el tiempo de espera según sea necesario
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {loading && <LoadingScreen />}

      <Typography variant="h4" gutterBottom textAlign="center" mb={2}>
        ⚙️ <FormattedMessage id="settings" />
      </Typography>

      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🌗 <FormattedMessage id="appareance" />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={handleToggleDarkMode}
                color="primary"
                sx={{ mr: 1 }}
              />
            }
            label={formatMessage({ id: "darkTheme" })}
          />
        </CardContent>
      </Card>

      {!isMobile && (
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔔 <FormattedMessage id="notifications" />
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={toggleNotificationPermission}
                  color="primary"
                  sx={{ mr: 1 }}
                  disabled={permissionDenied}
                />
              }
              label={formatMessage({ id: "allowNotifications" })}
            />
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🗣 <FormattedMessage id="language" />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant={currentLanguage === "es" ? "contained" : "outlined"}
            color="primary"
            onClick={() => toggleLanguage("es")}
            sx={{ mr: 2 }}
          >
            Español
          </Button>
          <Button
            variant={currentLanguage === "en" ? "contained" : "outlined"}
            color="primary"
            onClick={() => toggleLanguage("en")}
          >
            English
          </Button>
        </CardContent>
      </Card>

      <Account />
    </Container>
  );
};

export default GlobalSettingsPage;