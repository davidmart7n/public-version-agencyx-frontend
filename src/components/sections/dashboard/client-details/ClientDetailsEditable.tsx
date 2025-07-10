import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  TextField,
  Input,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from 'providers/firebaseConfig';
import { useAuth } from 'providers/AuthProvider';
import { useUsers } from 'providers/UsersProvider';
import { Client, useProjects } from 'providers/ProjectsProvider';
import Cropper from 'react-cropper'; // Importar Cropper
import 'cropperjs/dist/cropper.css'; // Importar los estilos de Cropper
import Banner from './Banner';
import Logo from './Logo';
import ContactEditable, { ContactType } from './ContactEditable';

interface Props {
  client: Client;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClientDetailsEditable: React.FC<Props> = ({ client, setEditable }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const { currentUser } = useUsers();
  const navigate = useNavigate();
  const { updateClient, addClient } = useProjects();
  const [bannerImage, setBannerImage] = useState<string | null>(null); // Banner temporal
  const cropperRef = useRef<any>(null); // Ref para el Cropper
  const [formData, setFormData] = useState({
    name: client.name || '',
    email: client.email || '',
    description: client.description || '',
    slogan: client.slogan || '',
    services: client.services || '',
    photoUrl: client.photoUrl || '',
    color: client.color || '',
    fonts: client.fonts || '',
    brandwords: client.brandwords || '',
    banner: client.banner || '',
    contact: client.contact || [],

  });
  const handleContactChange = (updatedContacts: Array<{ type: ContactType, value: string, link?: string }>) => {
    setFormData({ ...formData, contact: updatedContacts });
  };


  const handleUploadLogoToFirebase = async (imageUrl: string) => {
    if (!imageUrl || !clientId) {
      console.error('No se ha proporcionado un logo.');
      return;
    }

    // Si la URL ya es de Firebase Storage, solo actualizamos el logo sin subir la imagen
    if (imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
      await updateClient(clientId, { photoUrl: imageUrl }); // Actualizamos el logo en la base de datos del cliente
      console.log('Logo actualizado con la URL existente:', imageUrl);
      return;
    }
    try {
      // Creamos una referencia en Firebase Storage donde se guardará la imagen
      const storageRef = ref(storage, `client_logos/${clientId}_${Date.now()}.jpg`);
      console.log('Iniciando subida de logo...');

      // Usamos fetch para obtener el archivo de la URL proporcionada
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Error al obtener la imagen');

      const blob = await response.blob();
      console.log('Logo convertido a blob correctamente.');

      // Subimos el blob a Firebase Storage
      await uploadBytes(storageRef, blob);

      // Obtenemos la URL de descarga de la imagen subida
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizamos la propiedad del cliente con la nueva URL del logo
      await updateClient(clientId, { photoUrl: downloadURL });
      console.log('Logo subido y actualizado con éxito. URL:', downloadURL);
    } catch (error) {
      console.error('Error subiendo el logo:', error);
    }
  };

  const handleUploadBannerToFirebase = async (imageUrl: string) => {
    if (!imageUrl || !clientId) {
      console.error('No se ha proporcionado una URL o el clientId no es válido.');
      return;
    }

    // Si la URL ya es de Firebase Storage, solo actualizamos el banner sin subir la imagen
    if (imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
      await updateClient(clientId, { banner: imageUrl });
      setFormData({ ...formData, banner: imageUrl });
      console.log('Banner actualizado con la URL existente:', imageUrl);
      return;
    }

    try {
      // Creamos una referencia en Firebase Storage donde se guardará la imagen
      const storageRef = ref(storage, `client_photos/${clientId}_${Date.now()}.jpg`);
      console.log('Iniciando subida de imagen...');

      // Usamos fetch para obtener el archivo de la URL proporcionada
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Error al obtener la imagen');

      const blob = await response.blob();
      console.log('Imagen convertida a blob correctamente.');

      // Subimos el blob a Firebase Storage
      await uploadBytes(storageRef, blob);

      // Obtenemos la URL de descarga de la imagen subida
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizamos la propiedad banner del cliente con la nueva URL
      await updateClient(clientId, { banner: downloadURL });
      setFormData({ ...formData, banner: downloadURL });

      console.log('Banner subido y actualizado con éxito. URL:', downloadURL);
    } catch (error) {
      console.error('Error subiendo el banner:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpdate = (newLogoUrl: string) => {
    console.log('entramos en el update del padre... ', newLogoUrl);
    setFormData((prevState) => ({ ...prevState, photoUrl: newLogoUrl }));
    console.log('handle update padre: ', newLogoUrl);
  };

  // Función para manejar el cambio en el banner
  const handleBannerUpdate = (newBannerUrl: string) => {
    console.log('entramos en el update del padre... ', newBannerUrl);
    setFormData((prevState) => ({ ...prevState, banner: newBannerUrl }));
    console.log('handle update padre: ', newBannerUrl);
  };

  const handleSubmit = async () => {
    handleUploadBannerToFirebase(formData.banner);
    handleUploadLogoToFirebase(formData.photoUrl);

    const clientData = {
      ...formData,
    };

    if (client) {
      await updateClient(client.id, clientData); // Actualizar cliente
    } else {
      await addClient(clientData); // Crear cliente
    }

    setEditable((prev) => !prev);
  };

  return (
    <Box mx="auto" mt={0} p={0}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mr: 2 }}>
          <Button
            sx={{ p: '6px 12px', fontSize: '0.8rem' }}
            size="small"
            // startIcon={<DeleteIcon style={{ fontSize: 17 }} />}
            variant="contained"
            onClick={handleSubmit}
          >
            Actualizar
          </Button>
        </Box>
        <CardContent>
          {/* Título */}
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
          />
          <Logo currentLogo={formData.photoUrl} onLogoUpdate={handleLogoUpdate} />

          {/* Banner del cliente */}
          {/* Aquí pasamos las props al componente Banner */}
          <Banner
            currentBanner={client.banner}
            onBannerUpdate={handleBannerUpdate} // Pasamos la función para actualizar el banner
          />

          {/* Título */}
          <TextField
            sx={{ pt: 1 }}
            name="slogan" // Asegurar que el name coincide con formDat
            value={formData.slogan}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
          />

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Título de Descripción del Cliente más grande y alineado a la izquierda */}
          <Typography variant="h5" fontWeight="bold" sx={{ pt: 2, textAlign: 'left' }}>
            Descripción del Cliente
          </Typography>
          <TextField
            name="description" // Asegurar que el name coincide con formDat
            value={formData.description}
            margin="dense"
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={6} // Controla el número de filas visibles
            InputProps={{
              style: {
                resize: 'none', // Evitar el redimensionamiento
                overflowY: 'hidden', // Desactivar el scroll y mantener la altura controlada
                lineHeight: '1.4', // Controla la altura de las líneas
              },
            }}
            sx={{
              mt: 1,
              '& .MuiInputBase-root': {
                paddingBottom: 0,
                paddingTop: 0, // Eliminar el padding superior/inferior
              },
              '& textarea': {
                maxHeight: '150px', // Limitar la altura máxima
                height: 'auto', // Ajustar la altura al contenido
              },
            }}
          />

          {/* Divider entre secciones */}
          <Divider sx={{ my: 3 }} />

          {/* Título de Nuestros Servicios más grande y alineado a la izquierda */}
          <Typography variant="h5" fontWeight="bold" sx={{ pt: 0, textAlign: 'left' }}>
            Nuestros Servicios
          </Typography>

          <TextField
            name="services" // Asegurar que el name coincide con formDat
            value={formData.services}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={6} // Controla el número de filas visibles
            InputProps={{
              style: {
                resize: 'none', // Evitar el redimensionamiento
                overflowY: 'hidden', // Desactivar el scroll y mantener la altura controlada
                lineHeight: '1.4', // Controla la altura de las líneas
              },
            }}
            sx={{
              mt: 1,
              '& .MuiInputBase-root': {
                paddingBottom: 0,
                paddingTop: 0, // Eliminar el padding superior/inferior
              },
              '& textarea': {
                maxHeight: '150px', // Limitar la altura máxima
                height: 'auto', // Ajustar la altura al contenido
              },
            }}
          />

          {/* Divider entre secciones */}
          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" fontWeight="bold" sx={{ pt: 0, textAlign: 'left' }}>
            Branding
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {/* Columna de Color */}
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Typography variant="h6">Color:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  name="color"
                  value={formData.color} // Mostrar el color en formato hexadecimal
                  onChange={handleChange}
                  sx={{ width: 'auto', input: { textTransform: 'uppercase' } }}
                  size="small"
                  variant="outlined"
                // inputProps={{ maxLength: 7 }} // Limitar a un color de 7 caracteres (ej. #FFFFFF)
                />
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: client.color, // El color de fondo se mantiene
                    marginLeft: 2,
                  }}
                />
              </Box>
            </Box>

            {/* Columna de Fuentes */}
            <Box sx={{ flex: 1, textAlign: 'left', mr: 5 }}>
              <Typography variant="h6">Fuentes:</Typography>
              <TextField
                sx={{ pt: 1 }}
                name="fonts" // Asegurar que el name coincide con formDat
                value={formData.fonts}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Box>

            {/* Columna de Brandwords */}
            <Box sx={{ flex: 1, textAlign: 'left', ml: 2 }}>
              <Typography variant="h6">Brandwords:</Typography>
              <TextField
                sx={{ pt: 1 }}
                name="brandwords" // Asegurar que el name coincide con formDat
                value={formData.brandwords}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          {/* Contactos */}
          <ContactEditable
            initialContacts={formData.contact} // Aquí cambiamos 'contacts' por 'initialContacts'
            onChange={handleContactChange} // 'onContactChange' debería ser 'onChange' según la interfaz
          />

        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientDetailsEditable;
