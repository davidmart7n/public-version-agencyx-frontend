import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';
import CustomToolbar from './ToolbarSection';
import EventModal from './EventModal';
import { useEventsGoals } from 'providers/EventsGoalsProvider';

const localizer = momentLocalizer(moment);

const eventColors: string[] = [
  '#4CAF50', // Verde
  '#FF9800', // Naranja
  '#1976D2', // Azul
  '#9C27B0', // Morado
  '#F44336', // Rojo
  '#FFC107', // Amarillo
  '#00BCD4', // Cian
  '#8BC34A', // Verde claro
  '#E91E63', // Rosa
];

const MyCalendar = () => {
  const { events, addEvent, updateEvent, removeEvent } = useEventsGoals();
  // {
  //   id: "1",
  //   title: "Training",
  //   start: new Date(2025, 1, 19, 10, 0),
  //   end: new Date(2025, 1, 19, 12, 0),
  //   color: eventColors[0], // Asignar color al evento
  // },
  // {
  //   id: "2",
  //   title: "Shooting",
  //   start: new Date(2025, 1, 20, 10, 0),
  //   end: new Date(2025, 1, 20, 12, 0),
  //   color: eventColors[1], // Asignar color al evento
  // },

  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: '', // Siempre asignamos un ID numérico
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    color: eventColors[0], // Asignar color por defecto
  });

  const handleOpen = (slotInfo: { start: Date; end: Date }) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
      id: '',
      color: eventColors[0],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddEvent = async () => {
    if (newEvent.title.trim() !== '') {
      const randomColor = eventColors[Math.floor(Math.random() * eventColors.length)];
      await addEvent({ ...newEvent, id: Date.now().toString(), color: randomColor });
      setOpen(false);
    }
  };

  const handleSelectEvent = (event: any) => {
    setNewEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      color: event.color, // Asegurarse de que también se pasa el color
    });
    setOpen(true);
  };

  const handleUpdateEvent = async () => {
    await updateEvent(newEvent.id, newEvent);
    setOpen(false);
  };

  // Función para eliminar el evento
  const handleDeleteEvent = async (id: string) => {
    await removeEvent(id);
    setOpen(false);
  };

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.color, // Usamos el color del evento
        borderRadius: '8px',
        padding: '5px',
        color: 'white',
        fontWeight: 'bold',
        transition: '0.3s',
      },
    };
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
        width: '100%',
        maxWidth: '100%',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
          borderRadius: '15px',
          padding: '16px 32px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          width: '100%',
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          📅 CALENDARYX
        </Typography>
      </Box>

  <Box
  sx={{
    width: '100%',
    height: 'auto',
    overflowX: 'auto', // Habilitar scroll horizontal
    overflowY: 'hidden', // Evitar el scroll vertical
    '@media (max-width: 600px)': {
      padding: 0, // Eliminar el padding extra
      '& .rbc-calendar': {
        width: 'auto', // No hacer responsivo, y permitir desplazamiento horizontal
      },
    },
  }}
>
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    selectable
    components={{ toolbar: CustomToolbar }}
    onSelectSlot={handleOpen}
    onSelectEvent={handleSelectEvent}
    style={{
      height: 500,
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      width: '100%',
    }}
    eventPropGetter={eventStyleGetter}
  />
</Box>





      <EventModal
        open={open}
        handleClose={handleClose}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent} // Pasamos la función de eliminar
        newEvent={newEvent}
        setNewEvent={setNewEvent}
      />
    </Paper>
  );
};

export default MyCalendar;
