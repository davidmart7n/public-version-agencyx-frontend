import { Paper, Typography, Card, CardContent, Box, Chip, Stack } from '@mui/material';
import { useEventsGoals } from 'providers/EventsGoalsProvider';
import { useIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';

const AgendaProSection: React.FC = () => {
  const { events } = useEventsGoals();
  const { locale } = useIntl(); // Usamos `locale` para determinar el idioma

  // Filtrar los eventos futuros
  const upcomingEvents = events.filter(event => new Date(event.end).getTime() > Date.now());

  // Ordenar los eventos de más cercano a más lejano
  const sortedEvents = [...upcomingEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  // Agrupar eventos por mes
  const groupedByMonth = sortedEvents.reduce((acc, event) => {
    const monthYear = moment(event.start).format('MMMM YYYY'); // Obtener nombre del mes y el año
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, typeof sortedEvents>);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2, #9c27b0)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ marginRight: 2, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}
        >
          📅 AgendaX PRO
        </Typography>
      </Box>

      {sortedEvents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay eventos guardados.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {Object.entries(groupedByMonth).map(([monthYear, events]) => (
            <Box key={monthYear}>
              <Typography fontFamily={'Rubik'} variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                <FormattedMessage
                  id={`${monthYear.split(' ')[0]}`} // Mes
                  defaultMessage={monthYear.split(' ')[0]} // Default en caso de que no se encuentre
                />
                {` ${monthYear.split(' ')[1]}`} {/* Año al lado del mes */}
              </Typography>
              {events.map((event, index) => (
                <Card key={index} sx={{ display: 'flex', borderRadius: 2, boxShadow: 3, mb: 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      borderRadius: '2px 2px 0 0',
                      backgroundColor: event.color || '#1976d2',
                    }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6, fontSize: '0.95rem' }}
                    >
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {moment(event.start).format('DD MMM, HH:mm')} - {moment(event.end).format('HH:mm')}
                      </Typography>
                      <Chip label="Evento" size="small" sx={{ backgroundColor: event.color || '#1976d2', color: 'white' }} />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default AgendaProSection;
