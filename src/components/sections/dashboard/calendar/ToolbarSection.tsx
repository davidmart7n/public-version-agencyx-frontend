import { Button, ButtonGroup, Box, Typography } from '@mui/material';
import { NavigateAction, View } from 'react-big-calendar';
import moment from 'moment';

interface ToolbarProps {
  onNavigate: (action: NavigateAction) => void;
  onView: (view: View) => void;
  view: View;
  date: Date;
}

const CustomToolbar: React.FC<ToolbarProps> = ({ onNavigate, onView, view, date }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={1.5}
      bgcolor="background.paper"
      color="text.primary"
      borderRadius={1}
      boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
      sx={{
        '@media (max-width: 600px)': {
          padding: 0.5, // Reduce el padding en pantallas pequeñas
        },
      }}
    >
      {/* Botones de navegación */}
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => onNavigate('PREV')}
          sx={{
            '@media (max-width: 600px)': {
              fontSize: '0.6rem', // Reduce el tamaño de la fuente
              padding: '4px 8px', // Reduce el padding en pantallas pequeñas
            },
          }}
        >
          ←
        </Button>
        <Button
          onClick={() => onNavigate('TODAY')}
          sx={{
            '@media (max-width: 600px)': {
              fontSize: '0.6rem', // Reduce el tamaño de la fuente
              padding: '4px 8px', // Reduce el padding
            },
          }}
        >
          Hoy
        </Button>
        <Button
          onClick={() => onNavigate('NEXT')}
          sx={{
            '@media (max-width: 600px)': {
              fontSize: '0.6rem', // Reduce el tamaño de la fuente
              padding: '4px 8px', // Reduce el padding
            },
          }}
        >
          →
        </Button>
      </ButtonGroup>

      {/* Fecha actual formateada */}
      <Typography
        variant="body1"
        fontWeight="500"
        sx={{
          '@media (max-width: 600px)': {
            fontSize: '0.6rem', // Reduce el tamaño del texto
            fontWeight: '400', // Cambia el peso de la fuente para una apariencia más ligera
          },
        }}
      >
        {view === 'month' && moment(date).format('MMMM YYYY')}
        {view === 'week' &&
          `Semana del ${moment(date).startOf('week').format('DD MMM')} - ${moment(date).endOf('week').format('DD MMM YYYY')}`}
        {view === 'day' && moment(date).format('DD MMMM YYYY')}
        {view === 'agenda' && 'Agenda'}
      </Typography>

      {/* Botones de vista */}
      <ButtonGroup variant="outlined" size="small">
        {['month', 'week', 'day', 'agenda'].map((v) => (
          <Button
            key={v}
            onClick={() => onView(v as View)}
            variant={view === v ? 'contained' : 'outlined'}
            sx={{
              '@media (max-width: 600px)': {
                fontSize: '0.6rem', // Reduce el tamaño de la fuente aún más
                padding: '4px 8px', // Reduce el padding de los botones de vista
              },
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default CustomToolbar;