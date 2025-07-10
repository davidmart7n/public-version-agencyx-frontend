import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

interface OptionsMenuProps {
  handleEditProject: () => void;
  handleDeleteProject: (id: string) => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
  handleEditProject,
  handleDeleteProject,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const confirmDelete = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El proyecto será eliminado permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "secondary", // Color secundario para "Sí, eliminar tarea"
      cancelButtonColor: "#6c757d", // Color gris para "Cancelar"
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await handleDeleteProject(id);
          Swal.fire({
            title: "¡Eliminado!",
            text: "El proyecto ha sido eliminado",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar el proyecto",
            icon: "error",
          });
        } finally {
          handleClose(); // Cierra el menú después de la confirmación
        }
      }
    });
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="outlined"
        sx={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500 }}
      >
        <MoreVertIcon />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableAutoFocusItem
        MenuListProps={{
          disablePadding: true,
        }}
      >
        <MenuItem onClick={() => {
          handleEditProject();
          handleClose(); // Cierra el menú al hacer clic en "Editar"
        }}>
          <EditIcon style={{ fontSize: 17, marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => {
          confirmDelete('projectId');
          handleClose(); // Cierra el menú al hacer clic en "Eliminar"
        }}>
          <DeleteIcon style={{ fontSize: 17, marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </div>
  );
};

export default OptionsMenu;
