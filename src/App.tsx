import { requestFirebaseToken } from 'providers/firebaseConfig';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'providers/ScrollToTop'; // Importa ScrollToTop

const App = () => {

  useEffect(() => {

    const getToken = async () => {
      console.log('Token recibido:');
      const token = await requestFirebaseToken();
      console.log('Token recibido:', token);
    };


    const checkNewVersion = async () => {
      try {
        const response = await fetch("/version.json");
        const versionData = await response.json();
        
        const currentVersion = import.meta.env.VITE_APP_VERSION || "0.0.1";
        if (versionData.version !== currentVersion) {
          console.log("¡Nueva versión disponible!");
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
              registrations.forEach(registration => {
                registration.update();  // Forzar actualización del SW
              });
            });
          }
        }
      } catch (error) {
        console.error("Error al verificar la versión:", error);
      }
    };    
    

    console.log('Dentro de getToken useEffect');
    getToken();
    checkNewVersion();  // Llamamos a la función que revisa la versión

  }, []);

  return (
    <>
      <ScrollToTop /> {/* Aquí lo añadimos */}
      <Outlet />
    </>
  );
};
 
export default App;

