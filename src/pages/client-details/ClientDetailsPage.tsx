import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers } from 'providers/UsersProvider'; // Usar el contexto de UsersProvider
import { Client, useProjects } from 'providers/ProjectsProvider'; // Usar el contexto de ProjectsProvider
import ClientDetails from 'components/sections/dashboard/client-details/ClientDetails';
import ClientDetailsEditable from 'components/sections/dashboard/client-details/ClientDetailsEditable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import ClientModal from 'components/sections/dashboard/projects/ClientModal';


const ClientDetailsPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, deleteClient } = useProjects();
  const { currentUser } = useUsers();
  const [editable, setEditable] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (clientId) {
      const foundClient = clients.find((c) => c.id === clientId) || null;
      setClient(foundClient);
    }
  }, [clientId, clients]);

  const handleDeleteClient = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El cliente será eliminado permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "secondary",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (clientId) {
          deleteClient(clientId);
          navigate('/projects');
        }
      }
    });
  };

  const handleEditClient = () => {
    console.log('Cliente a editar:', client);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setOpen(true);
    console.log(client);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!client) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Typography variant="h5" color="textSecondary">
          Cliente no encontrado
        </Typography>
      </Box>
    );
  }


  const isAdmin = currentUser?.role === 'admin';

  return (
    <Box mx="auto" mt={0} p={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <Button
            onClick={() => {
              navigate('/projects');
              setTimeout(() => {
                const clientsSection = document.getElementById('clients');
                if (clientsSection) {
                  clientsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 90);
            }}
            startIcon={<ArrowBackIcon style={{ fontSize: 17 }} />}
            variant="outlined"
            sx={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500,ml:1 }}
          >
            Volver a Clientes
          </Button>
        </Box>
        {isAdmin && (  // Condición para mostrar los botones solo si el usuario es admin
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0, ml:1 }}>
            <Button
              onClick={() => setEditable((prev) => !prev)}
              startIcon={<EditIcon style={{ fontSize: 17 }} />}
              variant="outlined"
              sx={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500 }}
            >
              {editable ? 'Cancelar' : 'Editar'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0,mr:1 }}>
            <Button
              startIcon={<DeleteIcon style={{ fontSize: 17 }} />}
              variant="contained"
              onClick={handleDeleteClient}
              size='small'
            >
              Eliminar
            </Button>
          </Box>
        </Box>
        )}
      </Box>

      {editable ? (
        <ClientDetailsEditable client={client} setEditable={setEditable} />
      ) : (
        <ClientDetails client={client} setEditable={setEditable} isAdmin={isAdmin} />
      )}

      <ClientModal open={open} handleClose={handleCloseModal} client={client} />

      </Box>
  );
};

export default ClientDetailsPage;