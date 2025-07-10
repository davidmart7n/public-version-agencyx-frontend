import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import Circular from './Circular';

const LoadingScreen = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo translúcido para oscurecer el resto de la página
      zIndex: 9999, // Asegúrate de que la pantalla de carga esté sobre todo
    }}
  >
  </Box>
);

export default LoadingScreen;
