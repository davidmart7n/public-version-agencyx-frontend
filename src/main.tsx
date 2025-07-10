import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/useBreakPoint';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router.tsx';
import { theme } from 'theme/theme.ts';
import './index.css';
import { AuthProvider } from 'providers/AuthProvider';
import { UsersProvider } from 'providers/UsersProvider';
import { ProjectsProvider } from 'providers/ProjectsProvider';
import { EventsGoalsProvider } from 'providers/EventsGoalsProvider';
import { NotificationProvider } from 'providers/NotificationProvider';
import ScrollToTop from 'providers/ScrollToTop';
import { DarkModerProvider } from 'providers/DarkModeProvider';
import { IntlProvider } from 'providers/IntlProvider';
import { PomodoroProvider } from 'providers/PomodoroProvider';
import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';

// Función para detectar dispositivos móviles y tabletas
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);
}
// Inicializar Sentry
Sentry.init({
  dsn: 'https://a679a36cba33f37232e48dd91e8efb10@o4509252105469952.ingest.de.sentry.io/4509252120805456',
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  environment: import.meta.env.VITE_ENVIRONMENT
});

// Capturar errores globales
window.onerror = (message, source, lineno, colno, error) => {
  Sentry.captureException(error || message);
};

window.onunhandledrejection = (event) => {
  Sentry.captureException(event.reason);
};

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('✅ Service Worker registrado:', registration);

      // Detectar cuando un nuevo Service Worker está esperando
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;

        // if (installingWorker) {
        //   installingWorker.onstatechange = () => {
        //     if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
        //       // Evitar recarga en dispositivos móviles en bucle
        //       if (isMobileDevice() && !sessionStorage.getItem('sw-updated')) {
        //         sessionStorage.setItem('sw-updated', 'true'); // Marcar que la actualización ha sido detectada
        //         window.location.reload(); // Recarga solo una vez
        //         console.log('🔄 Recargando la página para aplicar la actualización del Service Worker');
        //       }
        //     }
        //   };
        // }
      };
    })
    .catch((error) => {
      console.error('❌ Error al registrar el Service Worker:', error);
      Sentry.captureException(error); // Captura el error en Sentry
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UsersProvider>
        <ProjectsProvider>
          <NotificationProvider>
            <EventsGoalsProvider>
              <ThemeProvider theme={theme}>
                <BreakpointsProvider>
                  <CssBaseline />
                  <DarkModerProvider>
                    <PomodoroProvider>
                      <IntlProvider>
                        <RouterProvider router={router} />
                      </IntlProvider>
                    </PomodoroProvider>
                  </DarkModerProvider>
                </BreakpointsProvider>
              </ThemeProvider>
            </EventsGoalsProvider>
          </NotificationProvider>
        </ProjectsProvider>
      </UsersProvider>
    </AuthProvider>
  </React.StrictMode>
);