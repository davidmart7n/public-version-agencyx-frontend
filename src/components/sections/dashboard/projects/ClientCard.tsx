import React from 'react';
import { Avatar, Box, Typography, Stack } from '@mui/material';
import { Client } from 'providers/ProjectsProvider';

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        cursor: 'pointer',
        transition: 'transform 0.4s ease-in-out', // Transición de escala más lenta
        '&:hover': { transform: 'scale(1.03)', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)' }, // Escalado más lento
        minHeight: '220px', // Tamaño fijo en altura
        display: 'flex',
        flexDirection: 'row', // Distribuir en fila
        justifyContent: 'space-between', // Separar imagen de contenido
        alignItems: 'center', // Alineación vertical
        '&:hover .slogan': { opacity: 1 }, // Aplica el hover en toda la tarjeta
      }}
      onClick={() => onClick(client)}
    >
      <Box
        sx={{
          width: '170px', // Tamaño más grande para la imagen
          height: '170px', // Tamaño más grande para la imagen
          marginRight: 2, // Espacio entre la imagen y el contenido
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden', // Evitar que la imagen se salga del contenedor
          borderRadius: '12px', // Bordes redondeados para el contenedor
          transition: 'transform 0.3s ease-in-out', // Transición para el logo
        }}
      >
        <img
          src={client.photoUrl || ''}
          alt={client.name}
          style={{
            width: '100%', // Ajusta la imagen al 100% de la anchura del contenedor
            height: '100%', // Ajusta la imagen al 100% de la altura del contenedor
            objectFit: 'contain', // La imagen se ajusta sin recortarse
            borderRadius: '12px', // Bordes redondeados para la imagen
          }}
        />
      </Box>
      {!client.photoUrl ? client.name.charAt(0) : null}

      {/* Contenido a la derecha */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h3"
          fontFamily={'Quicksand'}
          sx={{
            ml: 3,
            fontWeight: 700,
            color: 'black', // Color del texto principal
            textStroke: '2px black', // Un contorno que lo hace parecer más grueso
            fontSize: '1.7rem', // Puedes ajustar el tamaño
            transition: 'transform 0.3s ease-in-out', // Transición de crecimiento para el título
          }}
        >
          {client.name}
        </Typography>

        {/* Descripción con hover effect */}
        <Typography
          className="slogan" // Asignamos la clase para controlar la visibilidad
          variant="body2"
          sx={{
            mt: 1,
            ml: 3,
            fontStyle: 'italic',
            opacity: 0,
            transition: 'opacity 0.5s ease', // Transición de aparición más lenta
          }}
        >
          {client.slogan}
        </Typography>
      </Box>
    </Box>
  );
};

export default ClientCard;
