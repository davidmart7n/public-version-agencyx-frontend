import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, Card } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProjectCard from 'components/sections/dashboard/projects/ProjectCard';
import CreateProjectModal from 'components/sections/dashboard/projects/CreateProjectModal';
import { useProjects } from 'providers/ProjectsProvider';
import { Client } from 'providers/ProjectsProvider';
import paths from 'routes/path';
import { useNavigate } from 'react-router-dom';

interface ProjectProps {
  projects: any[];
  clients: Client[];
}

const ArchivedProjects: React.FC<ProjectProps> = ({ projects, clients }) => {
  const { fetchProjects, deleteProject } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleViewProject = (projectId: string) => {
    navigate(paths.projectDetails.replace(':projectId', projectId));
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
  };

  // Filtrar solo los proyectos archivados
  const archivedProjects = projects.filter((project) => project.isArchived === true);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: 20, fontWeight: 'bold' }} />} // Flecha más gruesa
          onClick={() => navigate(paths.projects)}
          sx={(theme) => ({ fontWeight: theme.typography.fontWeightRegular })} // ✅ Así accedes al fontWeightRegular del theme
        >
          Volver a Proyectos
        </Button>
      </Box>

      <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <Box>
          {/* Botón para volver a la lista de proyectos */}

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
              PROYECTOS ARCHIVADOS 🗃️
            </Typography>
          </Box>

          {/* Renderiza los proyectos archivados */}
          <Grid container spacing={3}>
            {archivedProjects.length > 0 ? (
              archivedProjects
                .sort((a, b) => {
                  if (!a.dueDate) return 1;
                  if (!b.dueDate) return -1;
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                })
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    clientName={
                      clients.find((client) => client.id === project.clientId)?.name ||
                      'Desconocido'
                    }
                    clientColor={
                      clients.find((client) => client.id === project.clientId)?.color ||
                      'Desconocido'
                    }
                    onView={handleViewProject}
                  />
                ))
            ) : (
              <Typography ml={5} variant="body1" color="textSecondary">
                No hay proyectos archivados.
              </Typography>
            )}
          </Grid>

          {/* Modal de creación o edición de proyecto */}
          <CreateProjectModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            projectToEdit={editingProject}
            setProjectToEdit={setEditingProject}
          />
        </Box>
      </Card>
    </>
  );
};

export default ArchivedProjects;
