import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Grid, Chip } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface ProjectCardProps {
  project: any;
  clientName: string;
  clientColor: string;
  onView: (projectId: string) => void;
}

const getStatusInfo = (progress: number) => {
  if (progress <= 10) return { label: 'Pendiente', color: '#d32f2f' }; // Rojo
  if (progress <= 40) return { label: 'Iniciado', color: '#1976d2' }; // Azul
  if (progress <= 85) return { label: 'Avanzado', color: '#28a745' }; // Verde más vivo
  return { label: 'Completado', color: '#ffcd00' }; // Naranja
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, clientName, clientColor, onView }) => {
  const rgbaColor = clientColor.replace('rgb', 'rgba').replace(')', ', 0.3)');
  const { label, color } = getStatusInfo(project.progress);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          minHeight: 220,
          border: 'none',
          boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.2)`, // Sombra base
          borderRadius: '12px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0px 0px 30px ${color}50`, // Sombra con el color de la etiqueta
          },
        }}
        onClick={() => onView(project.id)}
      >
        {/* Etiqueta de Estado con borde y fondo leve */}
        <Typography
          sx={{
            position: 'absolute',
            top: 22,
            right: 25,
            fontSize: '0.7rem',
            fontWeight: 'bold',
            padding: '3px 8px',
            borderRadius: '8px',
            backgroundColor: `${color}20`, // Fondo sutil con el color de la etiqueta
            color: color,
          }}
        >
          {label}
        </Typography>

        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 0.5, mr:10 }}>
            {project.name}
          </Typography>
          <Typography color="textSecondary" sx={{ marginBottom: 2 }}>
          <FormattedMessage id="client" />: {clientName}
          </Typography>

          {/* Barra de Progreso con el porcentaje visible dentro */}
          <Typography sx={{ marginBottom: 1 }}>
            <FormattedMessage id="progress" />:</Typography>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              '& .MuiLinearProgress-bar': {
                width: `${project.progress}%`,
              },
              mb: 0.5,
              mr: 2,
            }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {Math.round(project.progress)}% <FormattedMessage id="complete" />
          </Typography>
          {/* Fecha de entrega si existe */}
          {project.dueDate && !isNaN(new Date(project.dueDate).getTime()) && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 1, fontStyle: 'italic' }}
            >
              Para el {new Date(project.dueDate).toLocaleDateString('es-ES')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProjectCard;
