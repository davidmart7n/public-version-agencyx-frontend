import {
  Avatar,
  Box,
  Card,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Task, useProjects } from 'providers/ProjectsProvider';
import { Info as InfoIcon } from '@mui/icons-material'; // Para el icono
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const ProgressTracker = () => {
  const { projects, fetchProjects, clients } = useProjects(); // Aseguramos que también se obtengan los clientes
  const [topProjects, setTopProjects] = useState<{
    id: string;
    name: string;
    clientId: string;
    tasks: Task[];
    progress: number;
  }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      const sortedProjects = [...projects]
        .filter((p) => !p.isArchived) // Filtra los proyectos no archivados
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 5);
      setTopProjects(sortedProjects);
    };

    loadData();
  }, [projects, fetchProjects, clients]);

  const lastItemId = topProjects.length > 0 ? topProjects[topProjects.length - 1].id : null;

  return (
<Card sx={{ height: 1, overflow: 'hidden', pb: topProjects.length > 0 ? 2 : 0 }}>
<Box sx={{ p: 3, pb: 1.75, display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h4"
          textTransform="capitalize"
          fontWeight={700}
          sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.9)' }}
        >
          📊
        </Typography>
        <Box
          sx={{
            width: 6,
            height: 24,
            backgroundColor: 'rgba(175, 32, 242, 0.7)',
            borderRadius: 1,
            mr: 1.5,
          }}
        />
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: 'rgba(0, 0, 0, 0.9)' }}
        >
          <FormattedMessage id="projectsProgress" />
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb:1.25 }}>
        {/* Si no hay proyectos, mostrar el mensaje "¡No hay proyectos disponibles!" */}
        {topProjects.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              paddingBottom:1,
              textAlign: 'left',  // Alineación a la izquierda
              color: 'gray',
              marginTop: 1,       // Agregar un margen superior
              marginLeft: 1,      // Agregar un margen izquierdo
              bottom: 15,         // Aumenta la distancia desde el fondo (ajusta según necesites)
            }}
          >
            ¡No hay proyectos disponibles!
          </Typography>

        ) : (
          <Stack component="ul" sx={{ listStyle: 'none' }}>
            {topProjects.map(({ id, name, progress, clientId }) => {
              const client = clients.find((c) => c.id === clientId);
              const avatarUrl = client?.photoUrl || 'null';
              const progressColor = client?.color || 'primary';

              return (
                <React.Fragment key={id}>
                  <Stack
                    component="li"
                    direction="row"
                    alignItems="center"
                    sx={{ py: 0.75, width: 1 }}
                  >
                    <Box
                      sx={{
                        width: 60, // Tamaño fijo
                        height: 60, // Tamaño fijo
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden', // Evita que la imagen sobresalga
                      }}
                    >
                      <Link
                        to={`/projects/${id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <img
                          src={avatarUrl || undefined}
                          alt="Cliente"
                          style={{
                            borderRadius: 7,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Link>
                    </Box>
                    <Stack sx={{ width: 1, ml: 2 }}>
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: 15 }}>
                        <Link
                          to={`/projects/${id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {name}
                        </Link>
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          mt: 1,
                          height: 3.5,
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: `${progressColor}`,
                            width: `${progress}%`,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                  {id !== lastItemId && (
                    <Divider
                      sx={{
                        borderTop: 1,
                        borderTopColor: 'text.disabled',
                        m: 1,
                        my:1.2,
                        py: 0,
                        opacity: 0.5,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default ProgressTracker;
