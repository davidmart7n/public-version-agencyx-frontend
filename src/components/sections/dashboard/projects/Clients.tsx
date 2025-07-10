import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Card } from '@mui/material';
import ClientCard from './ClientCard';
import ClientModal from './ClientModal'; // Asumiendo que tienes un modal de cliente
import { useProjects } from 'providers/ProjectsProvider';
import { Client } from 'providers/ProjectsProvider'; // Asegúrate de importar la interfaz de Client
import { useNavigate } from 'react-router-dom';
import { useUsers } from 'providers/UsersProvider';
import { FormattedMessage } from 'react-intl';

const Clients: React.FC = () => {
  const { clients } = useProjects();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const navigate = useNavigate();
  const {currentUser}=useUsers();

  const handleOpenModal = (client: Client | null) => {
    setSelectedClient(client);
    setOpen(true);
  };

  const handleNavigate = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg,rgb(0, 4, 255),rgb(247, 153, 255)  )', // Azul a rosa chicle
            borderRadius: '15px',
            padding: '16px 32px',
            textAlign: 'center',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
            width: '100%', // Ocupa todo el ancho
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Rubik', sans-serif", // Fuente super redondeada
              fontWeight: 600,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <FormattedMessage id="ourClients"/> 🤝
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {clients.length > 0 ? (
            clients.map((client) => (
              <Grid item xs={12} sm={6} key={client.id} sx={{ height: '100%' }}>
                <ClientCard client={client} onClick={() => handleNavigate(client.id)} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" ml={4}>
              No hay clientes disponibles.
            </Typography>
          )}
        </Grid>
        {currentUser?.role === 'admin' && (

        <Box display="flex" justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          
          <Button variant="contained" color="primary" onClick={() => handleOpenModal(null)}>
            <FormattedMessage id="newClient"/>
          </Button>
        </Box>
        )}

        <ClientModal open={open} handleClose={handleCloseModal} client={selectedClient} />
      </Box>
    </Card>
  );
};

export default Clients;
