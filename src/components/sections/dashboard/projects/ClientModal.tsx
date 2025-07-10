import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Input,
  Box,
  Typography,
} from '@mui/material';
import { useProjects } from 'providers/ProjectsProvider';
import { Client } from 'providers/ProjectsProvider'; // Importamos la interfaz
import { uploadPhotoToStorage } from 'providers/firestore';

interface ClientModalProps {
  open: boolean;
  handleClose: () => void;
  client?: Client | null; // Puede ser un cliente o null al crear uno nuevo
}

const ClientModal: React.FC<ClientModalProps> = ({ open, handleClose, client }) => {
  const { addClient, updateClient } = useProjects(); // Cambié createClient por addClient
  const [photo, setPhoto] = useState<File | null>(null); // State to hold selected image

  // Estado para manejar los campos del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    slogan: '',
    services: '',
    persons: '',
    photoUrl: '', // Para almacenar la foto subida
    color: '#000000', // Color seleccionado (predeterminado: negro)
  });

  const colors = [
    // Rojos
    'rgb(255, 50, 150)', // Rosa intenso (tipo T-Mobile)
    'rgb(255, 20, 20)', // Rojo Coca-Cola (vibrante)
    'rgb(200, 50, 50)', // Rojo oscuro (tipo Ferrari)

    // Naranjas y Amarillos
    'rgb(255, 140, 10)', // Naranja Fanta (intenso)
    'rgb(255, 220, 0)', // Amarillo DHL (brillante)
    'rgb(255, 180, 0)', // Dorado (tipo McDonald's)

    // Verdes
    'rgb(0, 150, 0)', // Verde Heineken (vivo)
    'rgb(0, 130, 85)', // Verde Starbucks (vibrante)

    // Azules
    'rgb(50, 50, 200)', // Azul eléctrico (tipo PlayStation)
    'rgb(0, 120, 180)', // Azul IBM (saturado)
    'rgb(0, 60, 190)', // Azul Gillette (profundo)

    // Púrpura
    'rgb(90, 30, 160)', // Púrpura FedEx (fuerte)

    // Neutros
    'rgb(180, 190, 195)', // Gris Apple (claro)
    'rgb(30, 30, 30)', // Negro Nike (intenso)
  ];

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        description: client.description || '',
        slogan: client.slogan || 's',
        services: client.services || '',
        persons: client.persons || '',
        photoUrl: client.photoUrl || '',
        color: client.color || '#000000',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        description: '',
        slogan: '',
        services: '',
        persons: '',
        photoUrl: '',
        color: '#000000',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPhoto(file); // Guardamos solo el archivo en el estado
    }
  };

  const handleColorChange = (color: string) => {
    setFormData({ ...formData, color }); // Cambiar color cuando se hace clic en uno de los círculos
  };

  const superHandleClose = async () => {
    setPhoto(null);
    handleClose();
  };

  const handleSubmit = async () => {
    let photoUrl = formData.photoUrl; // Si ya existe una URL, la usamos directamente

    // Si hay una foto nueva, subimos a Storage
    if (photo) {
      photoUrl = await uploadPhotoToStorage(photo, 'client_photos');
    }

    const clientData = {
      ...formData,
      photoUrl, // Usamos la URL de la foto subida
    };

    if (client) {
      await updateClient(client.id, clientData); // Actualizar cliente
    } else {
      await addClient(clientData); // Crear cliente
    }
    if (photo) {
      setPhoto(null);
    }

    handleClose(); // Cerrar modal
  };

  return (
    <Dialog open={open} onClose={superHandleClose} fullWidth maxWidth="sm">
      <DialogTitle>{client ? 'Editar Cliente' : 'Crear Cliente'}</DialogTitle>
      <DialogContent>
        {/* Nombre */}
        <TextField
          fullWidth
          margin="dense"
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Email */}
        <TextField
          fullWidth
          margin="dense"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Eslogan"
          name="slogan"
          value={formData.slogan}
          onChange={handleChange}
        />

        {/* Descripción */}
        <TextField
          fullWidth
          margin="dense"
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Servicios */}
        <TextField
          fullWidth
          margin="dense"
          label="Nuestros servicios"
          name="services"
          value={formData.services}
          onChange={handleChange}
        />
        {/* Subir Foto */}
        <Box sx={{ marginBottom: 2 }}>
          <label htmlFor="photo-upload">
            <Button variant="contained" component="span">
              Subir Foto
            </Button>
          </label>
          <Input
            id="photo-upload"
            type="file"
            onChange={handlePhotoChange}
            sx={{ display: 'none' }}
          />
          {photo && (
            <Box mt={2}>
              <Typography variant="body2">Foto seleccionada:</Typography>
              <img
                src={URL.createObjectURL(photo)}
                alt="Vista previa"
                style={{ maxWidth: 100, maxHeight: 100 }}
              />
            </Box>
          )}
        </Box>

        {/* Selección de color */}
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Branding Color:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Paleta de colores en un solo bloque */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)', // Ajusta el número de columnas según prefieras
              gap: 1,
              width: 'fit-content',
              padding: 1,
              border: '1px solid #ccc',
              borderRadius: 2,
            }}
          >
            {colors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  cursor: 'pointer',
                  borderRadius: 2,
                }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </Box>
          <Box
            sx={{
              ml: 3,
              width: 100,
              height: 100,
              background: `radial-gradient(circle, 
                     white 6%, rgba(255, 255, 255, 0.4) 20%, transparent 30%),
                     conic-gradient(red, orange, yellow, green, cyan, blue, purple, red)`,
              cursor: 'pointer',
              border: '1px solid #ccc',
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleColorChange(e.target.value)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0, // Hace invisible el input pero sigue funcionando
                cursor: 'pointer',
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={superHandleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {client ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientModal;