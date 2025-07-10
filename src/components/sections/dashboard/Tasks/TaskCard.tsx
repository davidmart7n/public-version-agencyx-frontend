import React from 'react';
import { Card, CardContent, Typography, Button, Box, Checkbox, IconButton } from '@mui/material';
import { Task } from 'providers/ProjectsProvider';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo'; // Icono para deshacer
import { FormattedMessage, useIntl } from 'react-intl';

interface TaskCardProps {
  task: Task;
  onEdit: (task?: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onComplete: (taskIds: string[]) => void;
  selectedTasks: string[];
  onSelectTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => Promise<void>; // Función para actualizar la tarea
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  selectedTasks,
  onSelectTask,
  updateTask,
}) => {
  const color = '#388E3C';
  const label = <FormattedMessage id="completed" defaultMessage="Completada" />

  // Función para revertir el estado de la tarea (desmarcar como completada)
  const handleUndo = async () => {
    await updateTask(task.id, { isDone: false });
  };

  return (
    <Card
      elevation={8}
      sx={{
        position: 'relative',
        minHeight: 200,
        height: '100%',
        border: 'none',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        transition: 'transform 0.3s ease',
        p: 2.5,
        pt: 0.5,
        bgcolor: 'background.paper',
      }}
    >
      {/* Mostrar la etiqueta de "Completada" si la tarea está terminada */}
      {task.isDone && (
        <Typography
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            padding: '4px 10px',
            borderRadius: '8px',
            backgroundColor: `${color}20`,
            color: color,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CheckIcon sx={{ fontSize: 16, marginRight: 1 }} /> {label}
        </Typography>
      )}

      {/* Mostrar el checkbox solo si la tarea NO está completada */}
      {!task.isDone && (
        <Checkbox
          checked={selectedTasks.includes(task.id)}
          onChange={() => onSelectTask(task.id)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      )}

      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontSize: '18px',
            fontWeight: 500,
            mb: 0,
            color: 'black',
            fontFamily: 'Rubik, sans-serif',
            display: 'inline-block',
            position: 'relative',
          }}
        >
          {task.name}
        </Typography>

        <Box
          sx={{ width: '70%', height: '3px', backgroundColor: 'blue', marginTop: '0px', mb: 2 }}
        />

        <Typography variant="body1" sx={{ mb: 1, color: 'textSecondary' }}>
          {task.description}
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        <FormattedMessage id="responsible"/>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 500 }}>
          {task.assignedUsers.length > 0
            ? task.assignedUsers.map((u) => u.fullName).join(', ')
            : 'Ninguno'}
        </Typography>


        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          <FormattedMessage id="finishBefore"/>{' '}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha de vencimiento'}
        </Typography>
      </CardContent>

      {/* Botones: Editar, Completar y Eliminar */}
      <Box sx={{ display: 'flex', gap: 1, ml: 2, mt: 2, justifyContent: 'flex-start' }}>
        <Button
          onClick={() => onEdit(task)}
          variant="outlined"
          color="primary"
          size="small"
          sx={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            height: '30px',
            opacity: task.isDone ? 0.5 : 1,
          }}
          disabled={task.isDone}
        >
          <FormattedMessage id="edit"/>
        </Button>
        <Button
          onClick={() => onDelete(task.id)}
          variant="outlined"
          color="error"
          size="small"
          sx={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            height: '30px',
            opacity: task.isDone ? 0.5 : 1,
          }}
          disabled={task.isDone}
        >
          <FormattedMessage id="delete"/>
        </Button>
      </Box>

      {/* Icono de deshacer en la parte inferior derecha */}
      {task.isDone && (
        <IconButton
          onClick={handleUndo}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            padding: 1,
          }}
        >
          <UndoIcon />
        </IconButton>
      )}
    </Card>
  );
};

export default TaskCard;
