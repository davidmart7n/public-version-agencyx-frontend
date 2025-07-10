import React from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import HelpQuestions from 'components/sections/help/HelpQuestions';

const HelpPage = () => {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          flexGrow: 1,
          padding: { xs: 2, md: 4 }, // Menos padding en móviles (xs), más en pantallas grandes (md)
          overflow: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          paddingBottom={2}
          sx={{
            textAlign: 'center', // Centrar el texto
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          🛠️ Centro de Ayuda
        </Typography>

        <Grid
          container
          spacing={0}
          sx={{
            height: 'auto',
            width: '100%',
            justifyContent: 'center', // Centra los items
            alignItems: 'center', // Asegura que los items estén alineados verticalmente
          }}
        >
          {/* Columna de preguntas frecuentes y secciones, apilados uno sobre otro */}
          <Grid item xs={12}>
            <HelpQuestions />
          </Grid>

          {/* Columna de tutoriales (comentado por ahora) */}
          <Grid item xs={12}>
            {/* <HelpTutorials /> */}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HelpPage;
