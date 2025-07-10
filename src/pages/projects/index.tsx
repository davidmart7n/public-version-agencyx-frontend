import React, { useEffect, useState } from 'react';
import { useProjects } from '../../providers/ProjectsProvider';
import { Box, Button, CircularProgress, Container } from '@mui/material';
import Projects from 'components/sections/dashboard/projects/Projects';
import Clients from 'components/sections/dashboard/projects/Clients';

const ProjectsPage = () => {
  const { projects, clients } = useProjects(); // Ya tienes los proyectos del ProjectsProvider
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ marginBottom: 3 }}>
        {' '}
        {/* Añadimos un margen inferior de 3 unidades */}
        <Projects projects={projects} clients={clients} />
      </Box>

      <div id="clients">
        <Clients />
      </div>
    </Container>
  );
};

export default ProjectsPage;
