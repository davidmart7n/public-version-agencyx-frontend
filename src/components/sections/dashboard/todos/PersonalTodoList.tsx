import { Card, Box, Typography, Button, Stack, Chip, Checkbox, Divider } from "@mui/material";
import { useProjects } from "providers/ProjectsProvider";
import { User, useUsers } from "providers/UsersProvider";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import TodoList from "./TodoList";

const PersonalTodoList = () => {
  const { updateTask, fetchProjectById, tasks, clients } = useProjects();
  const { users, currentUser } = useUsers(); // ← Asegúrate que 'currentUser' esté disponible
  const [tasks5, setTasks5] = useState<Array<{
    id: string;
    name: string;
    dueDate: string;
    projectId: string;
    projectName: string;
    assignedUsers: User[];
    client?: { name: string; color: string };
    isDone: boolean;
  }>>([]); const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleCheckboxChange = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const completeSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await updateTask(taskId, { isDone: true });
    }
    setSelectedTasks([]);
  };

  const getUserImage = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.photoUrl || 'default-image-url';
  };

  useEffect(() => {
    const loadTasks = async () => {
      const userId = currentUser?.id;
      if (!userId) return;

      const userTasks = tasks.filter(
        (task) => !task.isDone && task.assignedUsers?.some((u) => u.id === userId)
      );

      const withDate = userTasks
        .filter((task) => task.dueDate)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

      const withoutDate = userTasks.filter((task) => !task.dueDate);

      const selectedTasks = [...withDate.slice(0, 5), ...withoutDate.slice(0, 5 - withDate.length)]
        .slice(0, 5);

      const tasksWithProjects = await Promise.all(
        selectedTasks.map(async (task) => {
          const project = await fetchProjectById(task.projectId);
          const client = clients.find((c) => c.id === project?.clientId);
          return {
            id: task.id,
            name: task.name,
            dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Fecha indefinida',
            projectId: task.projectId,
            projectName: project?.name || 'Sin Proyecto',
            assignedUsers: task.assignedUsers || [],
            client: client ? { name: client.name, color: client.color } : undefined,
            isDone: task.isDone,
          };
        })
      );

      setTasks5(tasksWithProjects);
    };

    loadTasks();
  }, [tasks, clients, currentUser]);

  const lastItemId = tasks5.length > 0 ? tasks5[tasks5.length - 1].id : null;

  return (
    <Card sx={{
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      borderRadius: 6,
      height: 1,
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 3, pb: selectedTasks.length > 0 ? 0 : 2 }}>
        {/* Bloque del título */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h4"
            textTransform="capitalize"
            fontWeight={700}
            sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.9)' }}
          >
            🎯
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
            <FormattedMessage id="yourTasks" />
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
              paddingBottom: 1         // Aumenta la distancia desde el fondo (ajusta según necesites)
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
export default PersonalTodoList;

