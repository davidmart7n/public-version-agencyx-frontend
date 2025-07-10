import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Autocomplete,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useProjects } from 'providers/ProjectsProvider';
import { useUsers } from 'providers/UsersProvider';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  projectToEdit?: {
    assignedUsers: never[];
    id: string;
    name: string;
    clientId: string;
    progress: number;
    photoUrl?: string;
    description?: string;
    dueDate?: Date;
    isArchived?: boolean;
  } | null;
  setProjectToEdit: (project: null) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onClose,
  projectToEdit,
  setProjectToEdit,
}) => {
  const { addProject, updateProject, clients } = useProjects();
  const { users } = useUsers(); // Asegúrate de que `users` esté disponible
  const [isArchived, setIsArchived] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    clientId: '', // Cliente seleccionado
    progress: 0,
    assignedUsers: [] as string[], // Lista de IDs de los usuarios asignados
    description: '', // Nueva propiedad para la descripción
    dueDate: '', // Nueva propiedad para la fecha de vencimiento
  });

  useEffect(() => {
    if (open) {
      if (projectToEdit) {
        setProjectData({
          name: projectToEdit.name,
          clientId: projectToEdit.clientId,
          progress: projectToEdit.progress || 0,
          assignedUsers: projectToEdit.assignedUsers || [],
          description: projectToEdit.description || '',
          dueDate: projectToEdit.dueDate
            ? new Date(projectToEdit.dueDate).toLocaleDateString('en-CA')
            : '', // Formato 'YYYY-MM-DD'
        });
      } else {
        setProjectData({
          name: '',
          clientId: '',
          progress: 0,
          assignedUsers: [],
          description: '',
          dueDate: '',
        });
      }
    }
  }, [open, projectToEdit]);

  // Asegúrate de que si estás editando un proyecto, se marque la casilla si ya está archivado
  useEffect(() => {
    if (projectToEdit) {
      setIsArchived(projectToEdit.isArchived || false);
    }
  }, [projectToEdit]);

  const handleArchiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsArchived(event.target.checked);
  };

  // Manejar cambios en los campos de texto (TextField)
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  // Manejar cambios en el campo de selección (Select)
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setProjectData({ ...projectData, [e.target.name as string]: e.target.value });
  };

  // Manejar cambios en la selección de los usuarios encargados
  const handleUsersChange = (e: SelectChangeEvent<typeof projectData.assignedUsers>) => {
    const value = e.target.value;
    setProjectData({
      ...projectData,
      assignedUsers: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async () => {
    const newProjectData = { ...projectData, isArchived };

    if (projectToEdit) {
      updateProject(projectToEdit.id, newProjectData);
    } else {
      addProject(newProjectData); // Añadimos progress cuando es un proyecto nuevo
    }

    handleClose();
  };

  const handleClose = () => {
    setProjectData({
      name: '',
      clientId: '',
      progress: 0,
      assignedUsers: [],
      description: '',
      dueDate: '',
    });
    setProjectToEdit(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{projectToEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
      {projectToEdit && (
        <FormControlLabel
          control={
            <Checkbox
              checked={isArchived}
              onChange={handleArchiveChange}
              name="archived"
              color="primary"
            />
          }
          label="Archivar"
          sx={{
            position: 'absolute',
            top: 10,
            right: 25,
          }}
        />
      )}
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre del Proyecto"
          name="name"
          value={projectData.name}
          onChange={handleTextFieldChange} // Aquí usamos el manejador para TextField
          margin="dense"
        />

        {/* Nueva entrada para la descripción */}
        <TextField
          fullWidth
          label="Descripción del Proyecto"
          name="description"
          value={projectData.description}
          onChange={handleTextFieldChange}
          margin="dense"
          multiline
          rows={4}
          InputProps={{
            style: {
              resize: 'none',
              overflowY: 'hidden',
              lineHeight: '1.4',
              fontSize: '16px', // 👈 añadir este fix mágico
            },
          }}
          sx={{
            mt: 2,
            '& .MuiInputBase-root': {
              paddingBottom: 0,
              paddingTop: 0,
            },
            '& textarea': {
              maxHeight: '150px',
              height: 'auto',
              fontSize: '16px', // 👈 también aquí aseguramos mínimo 16px para el textarea real
            },
          }}
        />

        {/* Lista desplegable para seleccionar un cliente */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="client-select-label" sx={{ lineHeight: '1.4' }}>
            Cliente
          </InputLabel>
          <Select
            labelId="client-select-label"
            name="clientId"
            value={projectData.clientId}
            onChange={handleSelectChange}
            label="Cliente"
            sx={{
              marginTop: 1, // Reducir margen superior
              lineHeight: 1.4, // Ajustar el interlineado
              height: 'auto', // Asegurarse de que el alto se ajuste
            }}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Lista desplegable para seleccionar múltiples encargados con Autocomplete */}
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => option.fullName}
          value={users.filter((user) => projectData.assignedUsers.includes(user.id))} // Mapea los IDs a objetos
          onChange={(_, newValue) =>
            setProjectData({ ...projectData, assignedUsers: newValue.map((user) => user.id) })
          }
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip label={option.fullName} {...getTagProps({ index })} key={option.id} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Encargados" />}
          sx={{ mt: 2 }}
        />

        {/* Nueva entrada para la fecha de vencimiento */}
        <TextField
          fullWidth
          label="Fecha de Vencimiento"
          name="dueDate"
          type="date"
          value={projectData.dueDate}
          onChange={handleTextFieldChange}
          margin="dense"
          InputLabelProps={{
            shrink: true, // Asegura que la etiqueta no se solape con el valor del input
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {projectToEdit ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;
