import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Task, useProjects } from 'providers/ProjectsProvider';
import { Info as InfoIcon } from '@mui/icons-material';
import { User, useUsers } from 'providers/UsersProvider';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


const TodoList = () => {
  const { updateTask, fetchProjectById, tasks, clients } = useProjects();
  const { users } = useUsers();
  const [tasks5, setTasks5] = useState<
    Array<{
      id: string;
      name: string;
      dueDate: string;
      projectId: string;
      projectName: string;
      assignedUsers: User[];
      client?: { name: string; color: string };
    }>
  >([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]); // Lista de IDs seleccionados

  // Función para manejar los cambios de selección del checkbox
  const handleCheckboxChange = (taskId: string) => {
    setSelectedTasks(
      (prevSelectedTasks) =>
        prevSelectedTasks.includes(taskId)
          ? prevSelectedTasks.filter((id) => id !== taskId) // Si ya está seleccionado, lo deselecciona
          : [...prevSelectedTasks, taskId], // Si no está seleccionado, lo agrega
    );
  };

  // Función para completar las tareas seleccionadas
  const completeSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      // Llamamos a `updateTask` para actualizar el estado de cada tarea
      await updateTask(taskId, { isDone: true });
    }

    setSelectedTasks([]); // Limpiar selección después de completar
  };

  const getUserImage = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.photoUrl || 'default-image-url';
  };

useEffect(() => {
  const loadTasks = async () => {
    const activeTasks = tasks.filter((task) => !task.isDone);

    const tasksWithDate = activeTasks
      .filter((task) => task.dueDate !== null)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    const tasksWithoutDate = activeTasks.filter((task) => task.dueDate === null);

    const tasksToDisplay = [
      ...tasksWithDate.slice(0, 5),
      ...tasksWithoutDate.slice(0, 5 - tasksWithDate.length),
    ].slice(0, 5);

    const tasksWithProjects = await Promise.all(
      tasksToDisplay.map(async (task) => {
        const project = await fetchProjectById(task.projectId);
        const client = clients.find((c) => c.id === project?.clientId);

        return {
          id: task.id,
          name: task.name,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : 'Fecha indefinida',
          projectId: task.projectId,
          projectName: project?.name || 'Sin Proyecto',
          assignedUsers: task.assignedUsers || [],
          client: client ? { name: client.name, color: client.color } : undefined,
          isDone: task.isDone,
        };
      }),
    );

    setTasks5(tasksWithProjects);
  };

  loadTasks();
}, [tasks, clients]); // 🔁 se actualiza cuando cambian tasks (globales) o los clientes


  const lastItemId = tasks5.length > 0 ? tasks5[tasks5.length - 1].id : null;

  return (
    <Card sx={{ height: 1, overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: selectedTasks.length > 0 ? 0 : 2 }}>
        {/* Bloque del título */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h4"
            textTransform="capitalize"
            fontWeight={700}
            sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.9)' }}
          >
            📌
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
            textTransform="capitalize"
            fontWeight={700}
            sx={{ color: 'rgba(0, 0, 0, 0.9)' }}
          >
            <FormattedMessage id="pendingTasks" />
          </Typography>
        </Box>
  
        {/* Bloque del botón */}
        {selectedTasks.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={completeSelectedTasks}
            >
              Completar
            </Button>
          </Box>
        )}
      </Box>
  
      <Box sx={{ px: 3, pb: 1.5 }}>
        {/* Si no hay tareas, mostrar el mensaje "¡No hay tareas disponibles!" */}
        {tasks5.length === 0 ? (
         <Typography
         variant="h6"
         sx={{
           textAlign: 'left',  // Alineación a la izquierda
           color: 'gray',
           ymarginTop: 0,       // Agregar un margen superior56767
           marginLeft: 1,      // Agregar un margen izquierdo
           bottom: 15,
           paddingBottom:1         // Aumenta la distancia desde el fondo (ajusta según necesites)
          }}
       >
            ¡No hay tareas disponibles!
          </Typography>
        ) : (
          <Stack component="ul" sx={{ listStyle: 'none', display: 'flex' }}>
            {tasks5.map(({ name, dueDate, projectName, id, assignedUsers, client, projectId }) => (
              <React.Fragment key={id}>
                <Stack
                  component="li"
                  direction="row"
                  alignItems="center"
                  sx={{ py: 1.5, width: 1, justifyContent: 'space-between' }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    {/* Envolvemos el nombre de la tarea con un Link */}
                    <Typography pb={1} variant="h6">
                      <Link
                        to={`/projects/${projectId}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {name}
                      </Link>
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" fontWeight="regular">
                        {dueDate ? new Date(dueDate).toLocaleDateString() : 'Sin fecha'} -{' '}{projectName}
                      </Typography>
                      {client && (
                        <Box ml={0}>
                          <Chip label={client.name} />
                        </Box>
                      )}
                    </Stack>
                  </Box>
  
                  <Box sx={{ display: 'flex', position: 'relative', mr: 3 }}>
                    {assignedUsers.slice(0, 3).map((user, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 25,
                          height: 25,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          marginLeft: index === 0 ? 0 : -4.8, // 🟢 Modo normal OK
                          border: '2px solid white',
                          position: 'relative',
  
                          '@media (max-width: 600px)': {
                            width: 20,
                            height: 20,
                            top: -2, // subimos un pelín
                            marginLeft: index === 0 ? 0 : -1, // 💥 MÁS negativo → ahora sí se pisan
                          },
                        }}
                      >
                        <img
                          src={getUserImage(user.id)}
                          alt={`assigned-user-${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
  
                  <Checkbox
                    size="small"
                    color="primary"
                    checked={selectedTasks.includes(id)}
                    onChange={() => handleCheckboxChange(id)} // Controlar la selección de la tarea
                  />
                </Stack>
  
                {id !== lastItemId && (
                  <Divider
                    sx={{ borderTop: 1, borderTopColor: 'text.disabled', m: 1, py: 0, opacity: 0.5 }}
                  />
                )}
              </React.Fragment>
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
  
};
export default TodoList;
