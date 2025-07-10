import { useState, useEffect } from 'react';
import {
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Container,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { User, useUsers } from 'providers/UsersProvider';
import { app, auth, firestore, storage } from 'providers/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getFirestore,
  Timestamp
} from 'firebase/firestore';
import {
  Business,
  AssignmentInd,
  AccountCircle,
  AccessTime,
  TaskAlt,
  CameraAlt,
} from '@mui/icons-material';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import { updateUserInFirestore, uploadPhotoToStorage } from 'providers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import Swal from 'sweetalert2';
import EditUserModal from 'components/sections/settings/EditUserModal';
import moment from 'moment';


const PersonalSettingsPage = () => {
  const { userId } = useParams(); // Obtener userId desde la URL
  const { users, currentUser, setUsers, deleteUser, updateUser } = useUsers(); // Obtener los usuarios, el currentUser y setUsers desde el contexto
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User>({
    id: '', // Valor por defecto
    photoUrl: '',
    fullName: '',
    role: 'user', // Valor por defecto
    email: '',
    status: '',
    createdAt: new Date(),
    sector: '', // Valor por defecto

  });

  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [lastTask, setLastTask] = useState('');
  const [photo, setPhoto] = useState<File | null>(null); // State to hold selected image
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');
  const navigate = useNavigate(); // Hook para navegar
  const { formatMessage } = useIntl(); // Usamos useIntl para acceder a las funciones de traducción
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [photoError, setPhotoError] = useState<string>('');


  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);

  useEffect(() => {
    const fetchUserData = () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      // Buscamos el usuario en el contexto por el userId
      const foundUser = users.find((user) => user.id === userId);
      if (foundUser) {
        setUserData(foundUser);
        setSelectedRole(foundUser.role);
      } else {
        console.error('User not found');
      }

      setLoading(false);
    };

    const fetchTasks = () => {
      // Simulación de datos de tareas completadas este mes
      setTasksCompleted(12);
      setLastTask('Revisar informes de ventas');
    };

    fetchUserData();
    fetchTasks();
  }, [userId, users]); // Dependencias: userId y users (para reaccionar cuando cambien)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
        console.log('Archivo seleccionado:', file);
        setPhoto(file);
      } else {
        console.error('El archivo no es una imagen válida');
      }
    }
  };


  const handleUpload = async () => {
    if (!photo) {
      setPhotoError('Inserte la foto desde el icono de la cámara');
      return;
    }

    try {
      console.log("📸 Subiendo foto:", photo.name);

      // Crear referencia en Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${photo.name}`);

      // Subir la imagen (El SDK maneja automáticamente las solicitudes HTTP)
      const snapshot = await uploadBytes(storageRef, photo);
      console.log("✅ Foto subida correctamente:", snapshot);

      // Obtener la URL pública de la imagen subida
      const photoUrl = await getDownloadURL(storageRef);
      console.log("🌐 URL de descarga:", photoUrl);

      // Actualizar el estado del usuario con la URL de la imagen
      setUserData((prevData) => ({
        ...prevData,
        photoUrl: photoUrl,  // Usar "img" para almacenar la URL
      }));

      // Ahora actualizamos Firestore con la nueva URL de la foto
      // Usamos el `updateUser` del contexto
      const userId = currentUser?.id; // Aquí asumo que `prevData` contiene el ID del usuario actual
      if (userId) {
        // Actualizamos el objeto de usuario en el estado con `updateUser`
        await updateUser(userId, { photoUrl: photoUrl });
        console.log("✅ Estado y Firestore actualizados con la URL de la imagen");
      } else {
        console.error("❌ No se encontró el ID del usuario.");
      }

    } catch (error) {
      console.error("❌ Error al subir la imagen:", error);
    }
  };


  const handleDeleteUser = () => {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'secondary',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (userId) {
          const updatedUsers = users.filter((user) => user.id !== userId);
          setUsers(updatedUsers);
          deleteUser(userId) // Actualizar el contexto con los usuarios restantes
          Swal.fire('Usuario eliminado correctamente', '', 'success');
        }
      }
    });
  };


  const handleRoleChange = (event: SelectChangeEvent<'admin' | 'user'>) => {
    const newRole = event.target.value as 'admin' | 'user';
    setSelectedRole(newRole);

    Swal.fire({
      title: 'Confirmar cambio de rol',
      text: `¿Estás seguro de que deseas cambiar el rol a ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cambiar rol',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (userId && userData) {
          // Actualizamos el rol directamente
          updateUser(userId, { role: newRole });

          // Actualizamos el rol en el estado local
          setUserData((prevData: User) => ({
            ...prevData,
            role: newRole,
          }));
        }
      } else {
        // Revertir el cambio si se cancela
        setSelectedRole(userData?.role || 'user');
      }
    });
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />;
  if (!userData) return <Typography>Error loading user data.</Typography>;

  // Comprobamos si el userId es igual al currentUser.id
  const isCurrentUser = userId === currentUser?.id;

  // Comprobamos si el currentUser es admin
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Botón de volver */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            fontSize: { xs: '0.75rem', sm: '1rem' }, // Botón más pequeño en pantallas pequeñas
            padding: { xs: '6px 12px', sm: '8px 16px' }, // Ajuste del padding
          }}
        >
          <FormattedMessage id="return" />
        </Button>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{ display: 'inline-block', width: '100%', mb: -1, pt: 2 }}
        >
          {formatMessage({ id: isCurrentUser ? 'myProfile' : 'userDetails' })}
        </Typography>
        {isCurrentUser && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenEditModal}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              fontSize: { xs: '0.75rem', sm: '1rem' }, // Botón más pequeño en pantallas pequeñas
              padding: { xs: '6px 12px', sm: '8px 16px' }, // Ajuste del padding
            }}
          >
            <FormattedMessage id="edit" />
          </Button>
        )}
      </Box>


      <Card sx={{ maxWidth: 600, mx: 'auto', p: 4, boxShadow: 5, borderRadius: 4 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar
            src={userData.photoUrl || ''}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '3px solid #1E5EFF' }}
          />
          <Typography variant="h4" fontWeight="bold">
            {userData.fullName || 'No Name'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userData.email || 'No Email'}
          </Typography>

          {/* Condición para mostrar los botones de cambiar foto de perfil solo si es el currentUser */}
          {isCurrentUser && (
            <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-photo-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-photo-upload">
                  <IconButton component="span" color="primary">
                    <CameraAlt />
                  </IconButton>
                </label>
                <Button variant="contained" color="primary" onClick={handleUpload}>
                  <FormattedMessage id="uploadPhoto" />
                </Button>
              </Box>
              {photoError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, textAlign: 'center', width: '100%' }}
                >
                  {photoError}
                </Typography>
              )}
            </Box>
          )}

          {/* Botón de eliminar y desplegable de cambiar rol solo si el currentUser es admin */}
          {isAdmin && !isCurrentUser && (
            <Box textAlign="center" mt={3}>
              <Button size="small" variant="outlined" color="error" onClick={handleDeleteUser}>
                <FormattedMessage id="deleteUser" />
              </Button>
              <Select
                value={selectedRole}
                onChange={handleRoleChange}
                displayEmpty
                sx={{
                  ml: 2, minWidth: 120,
                  marginTop: 1, // Reducir margen superior
                  lineHeight: 1.4, // Ajustar el interlineado
                  height: 'auto', // Asegurarse de que el alto se ajuste
                }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </Box>
          )}
        </CardContent>

        <Divider sx={{ my: 3 }} />

        <CardContent sx={{ mx: 10 }}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Business color="primary" />
              <Typography variant="h6">
                <strong>Sector:</strong> {userData.sector || 'Not specified'}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AssignmentInd color="primary" />
              <Typography variant="h6">
                <strong><FormattedMessage id="role" />:</strong> {userData.role || 'Not specified'}
              </Typography>
            </Box>

            {userData && userData.createdAt ? (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AccessTime color="primary" />
                <Typography variant="h6">
                  <strong><FormattedMessage id="from" />:</strong>{' '}
                  {
                    userData.createdAt instanceof Timestamp // Verifica si es un Timestamp de Firebase
                      ? moment(userData.createdAt.toDate()).format('DD/MM/YYYY') // Formato dd/mm/yyyy
                      : 'Fecha no válida'
                  }
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6">Loading...</Typography> // Muestra un mensaje si los datos no están cargados aún
            )}
          </Box>
        </CardContent>


        <Divider sx={{ my: 3 }} />

        <CardContent sx={{ alignItems: 'center', position: 'relative' }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={2}
            mt={3}
            sx={{ opacity: 0.5, pointerEvents: 'none' }}
          >
            Tu Progreso
          </Typography>
          <Typography
            variant="h4"
            color="black"
            fontWeight="bold"
            textAlign="center"
            mb={2}
            mt={-2}
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <FormattedMessage id="soon" />⌛
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={2} ml={7} sx={{ opacity: 0.5, pointerEvents: 'none' }}>
            <TaskAlt color="info" />
            <Typography variant="h6">
              <strong>Última tarea:</strong> {lastTask}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2} ml={7} sx={{ opacity: 0.5, pointerEvents: 'none' }}>
            <TaskAlt color="success" />
            <Typography variant="h6">
              <strong>Tareas completadas este mes:</strong> {tasksCompleted}
            </Typography>
          </Box>

          <Box textAlign="center" mt={2} sx={{ opacity: 0.5, pointerEvents: 'none' }}>
            <LinearProgress
              variant="determinate"
              value={(tasksCompleted / 20) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              {tasksCompleted} de 20 tareas completadas
            </Typography>
          </Box>
        </CardContent>

        <Divider sx={{ my: 3 }} />

        <Box textAlign="center">
          <Button variant="contained" color="primary" size="large">
            Ver más detalles
          </Button>
        </Box>
      </Card>
      <EditUserModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        userId={userId}
      />
    </Container>
  );
};

export default PersonalSettingsPage;