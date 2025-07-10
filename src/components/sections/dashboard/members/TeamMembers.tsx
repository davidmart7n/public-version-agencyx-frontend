import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom
import { Avatar, Box, Button, Card, Chip, Divider, Grid, IconButton, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  /* … resto de componentes … */
} from '@mui/material';

import { useState, useEffect, Fragment } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from 'providers/firebaseConfig';
import { getAuth, deleteUser } from 'firebase/auth';
import { useUsers } from 'providers/UsersProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import { FormattedMessage } from 'react-intl';

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { users, isAdmin, deleteUser } = useUsers();

  // Estado para el modal de invitación
  const [openInvite, setOpenInvite] = useState(false);
  const hashtags = "#MaenStudios #AgencyXApp";
  const inviteUrl = `https://maenstudiosx.space/authentication/sign-up`;
  const inviteMessage = `👉 ¡Únete al equipo de MAEN STUDIOS en AgencyX!⚡️\n\n✅ Tu talento es clave para construir el marketing del futuro.\n\n${hashtags}\n\nRegístrate aquí:\n`;
  const [copied, setCopied] = useState(false); // ✅ Para controlar el Snackbar


  useEffect(() => {
    setTeamMembers(users);
  }, [users]);

  // Handlers para el modal
  const handleOpenInvite = () => setOpenInvite(true);
  const handleCloseInvite = () => setOpenInvite(false);


  const handleCopy = async () => {
    const fullMessage = `${inviteMessage}${inviteUrl}`; 
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
    } catch {
      console.error('No se pudo copiar al portapapeles');
    }
  };


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          // 3. Compartimos con título y texto más llamativos
          title: '¡Únete al equipo de Maen Studios en AgencyX!',
          text: inviteMessage,
          url: inviteUrl
        });
      } catch (err) {
        console.warn('Share cancelled or failed', err);
      }
    } else {
      Swal.fire('No disponible', 'Tu navegador no soporta el diálogo de compartir.', 'info');
    }
  };


  // Filtramos usuarios en Requests (Pending) y Members (Accepted)
  const requests = teamMembers.filter((user) => user.status === 'pending');
  const members = teamMembers.filter((user) => user.status === 'accepted');


  // Función para aceptar usuario
  const handleAccept = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El usuario tendrá acceso a la plataforma",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",

    }).then(async (result) => {
      if (result.isConfirmed) {
        const userRef = doc(firestore, 'users', id);
        await updateDoc(userRef, { status: 'accepted' });

        setTeamMembers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, status: 'accepted' } : user)),
        );

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Aceptado!",
          text: "El usuario ya forma parte del equipo",
          icon: "success"
        });
      }
    });
  };

  // Función para rechazar usuario (Eliminar)
  const handleReject = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El usuario será rechazado y eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",

    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(id); // Borra de Firebase Auth

        setTeamMembers((prev) => prev.filter((user) => user.id !== id));

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Rechazado!",
          text: "El usuario ha sido eliminado",
          icon: "success"
        });
      }
    });
  };

  return (
    <>
      <Card sx={{ height: 1, overflow: 'hidden', color: 'dark.main' }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h4"
            textTransform="capitalize"
            fontWeight={700}
            sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.9)' }}
          >
            👥
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
            <FormattedMessage id="teamMembers" />
          </Typography>
        </Box>

        {/* Mostrar Requests solo si es admin y hay solicitudes pendientes */}
        {isAdmin && requests.length > 0 && (
          <Box sx={{ pb: 3, px: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <FormattedMessage id="requests" />
            </Typography>
            <Stack component="ul" direction="column" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {requests.map(({ id, img, fullName, sector }) => (
                <Fragment key={id}>
                  <Box component="li" sx={{ py: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar src={img} alt={fullName} />
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">{fullName}</Typography>
                        <Chip
                          label={sector}
                          sx={{
                            bgcolor: 'rgb(254, 247, 234)',
                            color: 'rgb(156, 146, 91)',
                            fontSize: 10.5,
                          }}
                        />
                      </Grid>
                      <Grid item ml="auto">
                        <Button
                          variant="contained"
                          sx={{
                            p: 1,
                            bgcolor: 'rgb(241, 251, 252)',
                            color: 'rgb(27, 108, 143)',
                            '&:hover': { bgcolor: 'rgb(220, 240, 242)' }, // Color un poco más intenso
                          }}
                          onClick={() => handleAccept(id)}
                        >
                          <IconifyIcon icon="mdi:check" width={20} />
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            ml: 1,
                            bgcolor: 'rgb(253, 225, 225)',
                            color: 'rgb(143, 27, 27)',
                            '&:hover': { bgcolor: 'rgb(240, 200, 200)' }, // Color un poco más intenso
                          }}
                          onClick={() => handleReject(id)}
                        >
                          <IconifyIcon icon="mdi:close" width={20} />
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                </Fragment>
              ))}
            </Stack>
          </Box>
        )}

        <Box sx={{ pb: 3, px: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, mt: -0.75 }}>
            <FormattedMessage id="members" />
          </Typography>
          <Stack component="ul" direction="column" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {members.map(({ id, photoUrl, fullName, sector }) => (
              <Fragment key={id}>
                <Box component="li" sx={{ py: 0.5 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar src={photoUrl} alt={fullName} />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        <Link
                          to={`/user-settings/${id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                          onClick={() => console.log(`/user-settings/${id}`)} // Imprimir al hacer clic
                        >
                          {fullName}
                        </Link>
                      </Typography>
                      <Chip
                        label={sector}
                        sx={{
                          bgcolor: 'rgb(234, 253, 255)',
                          color: 'rgb(27, 108, 143)',
                          fontSize: 10.5,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
              </Fragment>
            ))}
            {/* Invitación justo después del último miembro */}
            <Box component="li" sx={{ py: 1, pl: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconifyIcon icon="mdi:account-multiple-plus" />}
                onClick={handleOpenInvite}
                sx={{
                  bgcolor: 'transparent',
                  borderColor: '#dbe6fb',
                  color: '#1A237E',
                  '&:hover': {
                    bgcolor: '#dbe6fb',
                    borderColor: '#dbe6fb'
                  }
                }}
              >
                <FormattedMessage id="inviteNewMember" defaultMessage="Invitar a nuevo miembro" />
              </Button>

            </Box>
          </Stack>
        </Box>

        {/* Modal de Invitación */}
        <Dialog open={openInvite} onClose={handleCloseInvite} maxWidth="xs" fullWidth>
          <DialogTitle><FormattedMessage id="inviteModalTitle" defaultMessage="Invitar a nuevo miembro" /></DialogTitle>
          <DialogContent>
            <TextField
              label={<FormattedMessage id="inviteLink" defaultMessage="Mensaje de invitación" />}
              // 2. Mostramos el mensaje completo
              value={inviteMessage+inviteUrl}
              fullWidth
              multiline
              minRows={3}
              margin="dense"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <>
                    <Tooltip title={<FormattedMessage id="copy" defaultMessage="Copiar" />}>
                      <IconButton onClick={handleCopy} edge="end">
                        <IconifyIcon icon="mdi:content-copy" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="share" defaultMessage="Compartir" />}>
                      <IconButton onClick={handleShare} edge="end">
                        <IconifyIcon icon="mdi:share-variant" />
                      </IconButton>
                    </Tooltip>
                  </>
                )
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInvite}><FormattedMessage id="close" defaultMessage="Cerrar" /></Button>
          </DialogActions>
        </Dialog>
      </Card>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="¡Copiado!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>

  );
};

export default TeamMembers;