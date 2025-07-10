import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import AgendaProSection from 'components/sections/dashboard/calendar/AgendaProSection';
import MyCalendar from 'components/sections/dashboard/calendar/CalendarSection';
import { Box, CircularProgress } from '@mui/material';


const CalendarPage = () => {
  const location = useLocation(); // Accedemos al estado de la navegación
  const agendaRef = useRef<HTMLDivElement>(null);
  const navbarHeight = 80; // Ajusta este valor según la altura de tu navbar
  const [loading, setLoading] = useState(true);

  // Usamos navigate para futuras redirecciones si es necesario
  const navigate = useNavigate();

  // Cargar con retardo para simular loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.state?.fromAgendaSection) {
      console.log('Viene desde AgendaSection');  // Confirmar que estamos en el estado correcto
      
      setTimeout(() => {
        if (agendaRef.current) {
          // Verifica que la referencia no esté vacía
          console.log('AgendaProSection ref:', agendaRef.current);
  
          const rect = agendaRef.current.getBoundingClientRect();
          console.log('Rectángulo:', rect); // Verifica si el rectángulo tiene valores válidos
          
          const elementPosition = rect.top + window.scrollY;
          console.log('Posición del elemento:', elementPosition);
  
          // Asegúrate de que el valor de `elementPosition` es positivo
          if (elementPosition > 0) {
            window.scrollTo({
              top: elementPosition - navbarHeight - 20, // Ajuste para evitar que el navbar tape la sección
              behavior: 'smooth',
            });
          } else {
            console.error('Posición inválida para el scroll');
          }
        } else {
          console.error('agendaRef.current es nulo');
        }
      }, 700); // 300ms de retraso
    }
  }, [location]);
  
  // Dependemos de location para detectar cambios de ruta y estado

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <MyCalendar />
      <div ref={agendaRef}>
        <AgendaProSection />
      </div>
    </>
  );
};

export default CalendarPage;