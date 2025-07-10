import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  Chip,
  InputAdornment,
  Box,
} from '@mui/material';
import { Task } from 'providers/ProjectsProvider';
import { User, useUsers } from 'providers/UsersProvider';
import { CalendarIcon } from '@mui/x-date-pickers';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: Task) => void;
  isEditing: boolean;
  task: Task | null;
  projectId: string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  isEditing,
  task,
  projectId,
}) => {
  const { users, setUsers } = useUsers(); // Obtener los usuarios desde el contexto
  const [newTask, setNewTask] = useState<{
    name: string;
    description: string;
    dueDate: string;
    projectId: string;
  }>({
    name: '',
    description: '',
    dueDate: '',
    projectId: projectId,
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]); // Usuarios asignados

  // Cargar usuarios
  useEffect(() => {
    // const loadUsers = async () => {
    //   const usersFromContext = await fetchUsers();  // Obtenemos los usuarios
    //   setUsers(usersFromContext);  // Actualizamos los usuarios
    // };

    // loadUsers();

    if (isEditing && task) {
      setNewTask({
        name: task.name,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-CA') : '',
        projectId: task.projectId,
      });

      setSelectedUsers(task.assignedUsers || []);
    } else {
      setNewTask({ name: '', description: '', dueDate: '', projectId: projectId || '' });
      setSelectedUsers([]);
    }
  }, [isEditing, task]);

  const handleSave = () => {
    const taskData: Task = {
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      isDone: false,
      projectId: projectId || '',
      assignedUsers: selectedUsers.map((user) => ({
        id: user.id,
        photoUrl: user.photoUrl || '',
        fullName: user.fullName,
        sector: user.sector || '',
        role: user.role || 'user',
        email: user.email || '',
        status: user.status || 'active',
        createdAt:user.createdAt ||'no data'
      })),
      id: task?.id || '',
    };

    onSave(taskData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre de la Tarea"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Descripción"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          margin="dense"
          multiline
          rows={4} // Controla el número de filas visibles
          InputProps={{
            style: {
              resize: 'none', // Evitar el redimensionamiento
              overflowY: 'hidden', // Desactivar el scroll y mantener la altura controlada
              lineHeight: '1.4', // Esto controla la altura de las líneas
            },
          }}
          sx={{
            mt: 2,
            '& .MuiInputBase-root': {
              paddingBottom: 0,
              paddingTop: 0, // Eliminar el padding inferior
            },
            '& textarea': {
              maxHeight: '150px', // Limitar la altura máxima
              height: 'auto', // Dejar que la altura se ajuste al contenido
            },
          }}
        />
        <TextField
          fullWidth
          label="Fecha de Vencimiento"
          name="dueDate"
          type="date"
          InputLabelProps={{ shrink: true, size: 'normal' }}
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          margin="dense"
        />
        {/* Selección de usuarios asignados */}
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => option.fullName}
          value={selectedUsers}
          onChange={(_, newValue) => setSelectedUsers(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip label={option.fullName} {...getTagProps({ index })} key={option.id} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Asignar Usuarios" />}
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {isEditing ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
