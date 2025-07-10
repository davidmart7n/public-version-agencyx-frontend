import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Importamos el ícono de eliminar

interface EventModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddEvent: (event: any) => void;
  handleUpdateEvent: (event: any) => void;
  handleDeleteEvent: (id: string) => void; // Añadimos la función de eliminación evento
  newEvent: {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
  };
  setNewEvent: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
      description: string;
      start: Date;
      end: Date;
    }>
  >;
}

const EventModal = ({
  open,
  handleClose,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent, // Recibimos la función de eliminación
  newEvent,
  setNewEvent,
}: EventModalProps) => {
  const handleDateChange = (field: string) => (date: any) => {
    setNewEvent((prevState) => ({
      ...prevState,
      [field]: date,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {/* Botón de eliminar evento en la esquina izquierda */}
          <IconButton
            onClick={() => {
              if (newEvent.id) {
                handleDeleteEvent(newEvent.id); // Llamar a la función para eliminar el evento
              }
              handleClose(); // Cerrar el modal después de eliminar
            }}
            color="error"
            sx={{ padding: '6px' }} // Tamaño del botón
            disabled={!newEvent.id} // Deshabilitar el botón si no hay un evento seleccionado
          >
            <DeleteIcon />
          </IconButton>

          {/* Título del modal dependiendo de si es un evento nuevo o de edición */}
          {newEvent.id === '' ? 'Agregar Evento' : 'Editar Evento'}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del evento"
            fullWidth
            variant="outlined"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          <TextField
            autoFocus
            margin="dense"
            label="Descripción del evento"
            fullWidth
            variant="outlined"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
          {/* DateTimePicker para fecha y hora de inicio */}
          <DateTimePicker
            label="Fecha y hora de inicio"
            value={newEvent.start}
            onChange={handleDateChange('start')}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'dense',
                variant: 'outlined',
              },
            }}
          />
          {/* DateTimePicker para fecha y hora de fin */}
          <DateTimePicker
            label="Fecha y hora de fin"
            value={newEvent.end}
            onChange={handleDateChange('end')}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'dense',
                variant: 'outlined',
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (newEvent.title && newEvent.start && newEvent.end) {
                if (newEvent.id) {
                  handleUpdateEvent(newEvent); // Actualizar el evento si ya existe
                } else {
                  handleAddEvent(newEvent); // Guardar un nuevo evento
                }
              }
            }}
            color="primary"
            variant="contained"
            disabled={!newEvent.title || !newEvent.start || !newEvent.end}
          >
            {newEvent.id === '' ? 'Guardar' : 'Actualizar'}{' '}
            {/* Mostrar 'Actualizar' o 'Guardar' dependiendo del id */}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EventModal;
