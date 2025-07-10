import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Task, useProjects } from '../../providers/ProjectsProvider';
import { Container, Typography, Grid, Button, Box, Card, Snackbar, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TaskModal from 'components/sections/dashboard/Tasks/TaskModal';
import TaskCard from 'components/sections/dashboard/Tasks/TaskCard';
import CreateProjectModal from 'components/sections/dashboard/projects/CreateProjectModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsers } from 'providers/UsersProvider';
import { theme } from 'theme/theme';
import palette from 'theme/palette';
import { colors } from 'theme/colors';
import { useNotification } from 'providers/NotificationProvider';
import OptionsMenu from 'components/sections/dashboard/projects/OptionsMenu';
import Swal from 'sweetalert2';
import { FormattedMessage } from 'react-intl';


const ProjectDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, tasks, updateProject, fetchTasksForProject, addTask, updateTask, deleteTask, deleteProject } =
    useProjects();
  const [project, setProject] = useState<any | null>(null);
  const [tasksForProject, setTasksForProject] = useState<Task[]>([]); // Estado local para las tareas del proyecto
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]); // 🔹 Estado global de tareas seleccionadas
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { users, setUsers, currentUser } = useUsers();
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const allTasksCompleted = tasksForProject.every((task) => task.isDone);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { sendProjectNotification }: { sendProjectNotification: (project: Project) => Promise<void> } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditProject = () => {
    console.log('Proyecto a editar:', project); // Verifica los datos que estás pasando
    setEditingProject(project);
    setModalOpen(true); // Abre el modal en caso de editar un proyecto
  };

  const handleDeleteProject = () => {
    deleteProject(project.id); // Pasa solo el ID del proyecto
    navigate('/projects');
  };

  // Cambia useEffect para que no afecte al contexto global de tareas
  useEffect(() => {
    const currentProject = projects.find((p) => p.id === projectId);
    setProject(currentProject);
    if (currentProject) {
      const fetchProjectTasks = async () => {
        const fetchedTasks = await fetchTasksForProject(currentProject.id);
        setTasksForProject(fetchedTasks); // Aquí debería ser Task[] siempre
        console.log(fetchedTasks, tasks);
      };
      fetchProjectTasks();
    }
  }, [projectId, projects, fetchTasksForProject]);

  const handleCreateTask = async (taskData: Task) => {
    if (!project) return;
    await addTask(taskData);
    // No llamamos a fetchTasksForProject, ya que solo actualizamos el estado local
    setTasksForProject((prevTasks) => [...prevTasks, taskData]); // Actualizamos las tareas localmente
    setOpenTaskModal(false);
  };

  const handleSaveEditedTask = async (taskData: Task) => {
    if (!selectedTask || !project) return;
    await updateTask(selectedTask.id, taskData);
    // Actualizamos las tareas localmente después de editar
    setTasksForProject((prevTasks) =>
      prevTasks.map((task) => (task.id === selectedTask.id ? { ...task, ...taskData } : task)),
    );
    setOpenTaskModal(false);
  };

  const openTaskModalHandler = (task?: Task) => {
    setIsEditing(!!task);
    setSelectedTask(task || null);
    setOpenTaskModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;

    Swal.fire({
      title: "¿Estás seguro?",
      text: "La tarea será eliminada permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "secondary", // Color secundario para "Sí, eliminar tarea"
      cancelButtonColor: "#6c757d", // Color gris para "Cancelar"
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTask(taskId);
          // Filtramos las tareas localmente después de eliminar
          setTasksForProject((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

          // Mostrar mensaje de éxito
          Swal.fire({
            title: "¡Hasta nunca!",
            text: "La tarea ha sido eliminada",
            icon: "success",
          });
        } catch (error) {
          // Manejo de errores
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la tarea",
            icon: "error",
          });
        }
      }
    });
  };

  const handleCompleteTasks = async () => {
    // 🔹 Lógica para completar tareas
    console.log('Completando tareas:', selectedTasks);

    // Recorremos todas las tareas seleccionadas
    selectedTasks.forEach((taskId) => {
      // Llamamos a updateTask para cada tarea seleccionada
      updateTask(taskId, { isDone: true });
    });

    // Limpiar selección después de completar
    setSelectedTasks([]);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const onCompleted = async () => {
    if (!projectId) return; // Prevenir errores si projectId es undefined

    Swal.fire({
      title: "¿Estás seguro?",
      text: "El proyecto se archivará y se enviará una notificación de 'completado'",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Actualizar el proyecto con isArchived=true
          await updateProject(projectId, { isArchived: true } as unknown as { name: string; clientId: string });

          await sendProjectNotification(project);

          // Mostrar mensaje de confirmación
          setNotificationMessage(`El proyecto se ha archivado y se ha enviado una notificación de completado.`);
          setOpenSnackbar(true); // Abrir la snackbar
        } catch (error) {
          // Manejo de errores
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al archivar el proyecto",
            icon: "error",
          });
        }
      }
    });
  };
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project)
    return (
      <Typography variant="h5" textAlign="center">
        Proyecto no encontrado...
      </Typography>
    );


  return (
    <Container maxWidth="lg" sx={{ paddingTop: 1 }}>
      {/* Contenedor de la fila superior */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* Botón de Volver a Proyectos */}
        <Button
          onClick={() => navigate('/projects')}
          startIcon={<ArrowBackIcon style={{ fontSize: 17 }} />}
          variant="outlined"
          sx={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500 }}
        >
          <FormattedMessage id="backToProjects" />
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedTasks.length > 0 && (
            <Button
              onClick={handleCompleteTasks}
              variant="outlined"
              color="primary"
              sx={{
                ml: 1,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                borderColor: (theme) => theme.palette.primary.dark, // Usamos el color dorado desde el tema
              }}
            >
              {' '}
              Completar tareas ({selectedTasks.length})
            </Button>
          )}
          {currentUser?.role === 'admin' && (

            <OptionsMenu
              handleEditProject={handleEditProject}  // Pasamos la función de editar
              handleDeleteProject={handleDeleteProject}  // Pasamos la función de eliminar
            />
          )}
        </Box>
      </Box>
      <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
        {/* Encabezado del Proyecto */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0072ff,#00c6ff)',
            borderRadius: '15px',
            padding: '16px 32px',
            textAlign: 'center',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
            width: '100%',
            marginBottom: 2.5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 600,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            }}
          >
            {project.name}
          </Typography>
        </Box>
        <Box p={4} pt={0}>
          <Typography
            variant="body1"
            sx={{ color: 'black', fontWeight: 400, textAlign: 'center', fontFamily: 'Rubik' }}
          >
            {project.description}
          </Typography>
        </Box>
        {/* Lista de Tareas usando TaskCard */}
        <Grid container spacing={3} justifyContent="center">
          {[...tasksForProject]
            .sort((a, b) => {
              const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
              const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
              return dateA - dateB;
            }).map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id} mb={1.5}>
                <TaskCard
                  task={task}
                  onEdit={openTaskModalHandler}
                  onDelete={handleDeleteTask}
                  selectedTasks={selectedTasks}
                  onSelectTask={handleSelectTask}
                  onComplete={handleCompleteTasks}
                  updateTask={updateTask}
                />
              </Grid>
            ))}
        </Grid>


        {/* Botón de Crear Nueva Tarea */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 2 }}>
          <Button
            aria-hidden="false"
            onClick={() => openTaskModalHandler()}
            variant="contained"
            color="primary"
            sx={{
              paddingX: 4,
              paddingY: 1.5,
              fontSize: '1rem',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            <FormattedMessage id="newTask" />
          </Button>

          {currentUser?.role === 'admin' && (
            <Button
              variant="outlined"
              color="gold"
              sx={{
                paddingX: 4,
                paddingY: 1.5,
                fontSize: '1rem',
                boxShadow: 2,
                backgroundColor: allTasksCompleted ? 'gold' : 'grey',
                borderColor: allTasksCompleted ? 'gold' : 'grey', // Establecer el borde dorado cuando está habilitado
                '&:hover': {
                  backgroundColor: allTasksCompleted ? colors.gold[50] : 'grey',
                  borderColor: allTasksCompleted ? 'gold' : 'grey', // Mantener el borde dorado en hover
                },
                cursor: allTasksCompleted ? 'pointer' : 'not-allowed',
                marginLeft: 2,
                bgcolor: allTasksCompleted ? 'white' : 'white',
                color: allTasksCompleted ? 'success' : 'default'
              }}
              disabled={!allTasksCompleted || tasksForProject.length === 0 || project.isArchived} // Deshabilitar el botón si no todas las tareas están completadas, no hay tareas o el proyecto está archivado
              onClick={onCompleted} // Llamar a onCompleted al hacer clic
            >
              <FormattedMessage id="projectCompleted" />
            </Button>)}
        </Box>

        {/* Modal de Creación/Edición de Tarea */}
        <TaskModal
          open={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          onSave={isEditing ? handleSaveEditedTask : handleCreateTask}
          isEditing={isEditing}
          task={selectedTask}
          projectId={project?.id || ''} // ✅ Asegurar que se pase correctamente el projectId
        />
        <CreateProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          projectToEdit={editingProject}
          setProjectToEdit={setEditingProject}
        />
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={notificationMessage}
      />
    </Container>
  );

};

export default ProjectDetailsPage;