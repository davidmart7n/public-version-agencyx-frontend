import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useEventsGoals } from 'providers/EventsGoalsProvider';
import { FormattedMessage } from 'react-intl';

const AgendaSection: React.FC = () => {
  const { events } = useEventsGoals();
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Filtrar los eventos futuros y ordenar por la fecha de inicio
  const upcomingEvents = events
    .filter((event: { start: moment.MomentInput }) => moment(event.start).isAfter(moment())) // Filtra solo los eventos futuros
    .sort((a, b) => moment(a.start).isBefore(moment(b.start)) ? -1 : 1) // Ordena los eventos por la fecha de inicio
    .slice(0, 5); // Limita a los 5 primeros eventos

  const handleEventClick = (eventId: string) => {
    navigate(`/calendar`, { state: { fromAgendaSection: true } });
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, ml: 0 }}>
      <Box sx={{ p: 3, pb: 2,ml:0, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ mr: 1 }}>
          📆
        </Typography>
        <Box
          sx={{
            width: 6,
            height: 24,
            backgroundColor: 'rgba(175, 32, 242, 0.7)',
            borderRadius: 1,
            mr: 1.5,
          }}
        />
        <Typography variant="h4" fontWeight={700}>
          Agenda
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ mb: 0, ml: 3, mt: 1 }}>
        <FormattedMessage id="upcomingEvents" />
      </Typography>

      {upcomingEvents.length === 0 ? (
        <Typography
                    variant="h6"
                    sx={{
                      textAlign: 'left',  // Alineación a la izquierda
                      color: 'gray',
                      marginTop: 1,       // Agregar un margen superior
                      marginLeft: 3,      // Agregar un margen izquierdo
                      paddingBottom: 2,         // Aumenta la distancia desde el fondo (ajusta según necesites)
                    }}
                  >
          ¡No hay eventos próximos!
        </Typography>
      ) : (
        <List sx={{ ml: 1 }}>
          {upcomingEvents.map((event, index) => (
            <ListItem key={event.id} sx={{ py: 2.2, ml: 2, position: 'relative' }} onClick={() => handleEventClick(event.id)}>
              <Box
                sx={{
                  width: 6,
                  height: 30,
                  borderRadius: 2,
                  backgroundColor: event.color || '#1976d2',
                  mr: 2,
                  zIndex: 1,
                }}
              />
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">{event.title}</Typography>}
                secondary={`${moment(event.start).format('DD MMM, HH:mm')} - ${moment(event.end).format('HH:mm')}`}
              />
              {index !== upcomingEvents.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 3,
                    right: 50,
                    width: 'calc(100% - 90px)',
                    height: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default AgendaSection;
