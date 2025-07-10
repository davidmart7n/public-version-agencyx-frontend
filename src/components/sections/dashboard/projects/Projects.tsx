import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, Card } from '@mui/material';
import ProjectCard from 'components/sections/dashboard/projects/ProjectCard';
import CreateProjectModal from 'components/sections/dashboard/projects/CreateProjectModal';
import { useProjects } from 'providers/ProjectsProvider'; // Asegúrate de usar el provider de proyectos
import { useUsers } from 'providers/UsersProvider';
import { Client } from 'providers/ProjectsProvider'; // Si usas la interfaz Client
import paths from 'routes/path';
import { useNavigate } from 'react-router-dom';
import { ariaHidden } from '@mui/material/Modal/ModalManager';
import { FormattedMessage } from 'react-intl';

interface ProjectProps {
  projects: any[]; // Aquí deberías definir bien el tipo de proyectos en tu app.
  clients: Client[];
}

const Projects: React.FC<ProjectProps> = ({ projects, clients }) => {
  const { fetchProjects, deleteProject, addClient } = useProjects(); // Usamos las funciones del provider
  const {currentUser}=useUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const navigate = useNavigate();
  const activeProjects = projects.filter((project) => !project.isArchived);

  useEffect(() => {
    fetchProjects(); // Traemos los proyectos cuando se monta el componente
  }, [fetchProjects]);

  const handleViewProject = (projectId: string) => {
    navigate(paths.projectDetails.replace(':projectId', projectId)); // Verifica si el path es correcto

    // Lógica para ver el proyecto. Puedes incluir el redireccionamiento aquí si lo deseas.
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setModalOpen(true); // Abre el modal en caso de editar un proyecto
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId); // Llamamos a la función de eliminar
  };

  // console.log("Lista de proyectos antes de renderizar:", projects)

  return (
    <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Box>
        {/* Título de la sección */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
            borderRadius: '15px',
            padding: '16px 32px',
            textAlign: 'center',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
            width: '100%',
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 600,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            <FormattedMessage id="ourProjects"/> 📊
          </Typography>
        </Box>
        {/* Renderiza los proyectos */}
        <Grid container spacing={3}>
          {activeProjects.length > 0 ? (
            [...activeProjects]
              .sort((a, b) => {
                if (!a.dueDate) return 1; // Si no tiene dueDate, va al final
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              })
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  clientName={
                    clients.find((client) => client.id === project.clientId)?.name || 'Desconocido'
                  }
                  clientColor={
                    clients.find((client) => client.id === project.clientId)?.color || 'Desconocido'
                  }
                  onView={handleViewProject}
                />
              ))
          ) : (
            <Typography variant="body1" color="textSecondary" ml={4}>
              No hay proyectos disponibles.
            </Typography>
          )}
        </Grid>

        {/* Botón para crear proyecto */}
        <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 2, mb: 3 }}>
        {currentUser?.role === 'admin' && (

          <Button
            aria-hidden="false"
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            <FormattedMessage id="newProject"/>
          </Button>)}
          <Button
            aria-hidden="false"
            variant="outlined"
            color="primary"
            onClick={() => navigate(paths.archivedProjects)}
          >
            <FormattedMessage id="archived"/>
          </Button>
        </Box>

        {/* Modal de creación o edición de proyecto */}
        <CreateProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          projectToEdit={editingProject}
          setProjectToEdit={setEditingProject}
        />
      </Box>
    </Card>
  );
};

export default Projects;
