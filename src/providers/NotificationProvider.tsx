import React, { createContext, useState, useEffect, useContext } from 'react';
import { Project, useProjects } from './ProjectsProvider'; // Importa el ProjectsProvider para acceder a los proyectos

// Definir el tipo para el contexto de notificaciones
interface NotificationContextType {
  showNotificationCard: boolean;
  setShowNotificationCard: React.Dispatch<React.SetStateAction<boolean>>;
  sendProjectNotification: (project: Project) => Promise<void>; // 🔹 Agregamos la función al contexto

}

// Crear el contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Crear el hook personalizado para usar el contexto
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

const NotificationProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [showNotificationCard, setShowNotificationCard] = useState(true); // Controla si mostrar la tarjeta de notificación
  
  const sendProjectNotification = async (project: Project) => {
    // Enviar la solicitud a Firebase Function
    await fetch(import.meta.env.VITE_NOTIFICATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '¡Proyecto Completado!',
        body: `El proyecto ${project.name} ha sido completado  y archivado`,
      }),
    });

    setShowNotificationCard(true); // Mostrar la notificación en la UI
  };

  return (
    <NotificationContext.Provider value={{ showNotificationCard, setShowNotificationCard, sendProjectNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider };