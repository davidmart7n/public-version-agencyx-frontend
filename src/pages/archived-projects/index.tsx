import React, { useEffect, useState } from 'react';
import { useProjects } from '../../providers/ProjectsProvider';
import { Box, Button, Container } from '@mui/material';
import Clients from 'components/sections/dashboard/projects/Clients';
import Projects from 'components/sections/dashboard/projects/Projects'; // Importamos el nuevo componente
import ArchivedProjects from 'components/sections/dashboard/projects/ArchivedProjects';

const ArchivedProjectsPage = () => {
  const { projects, clients } = useProjects(); // Ya tienes los proyectos del ProjectsProvider

  return (
    <Container>
      <Box sx={{ marginBottom: 3 }}>
        {' '}
        {/* Añadimos un margen inferior de 3 unidades */}
        <ArchivedProjects projects={projects} clients={clients} />
      </Box>
    </Container>
  );
};

export default ArchivedProjectsPage;
