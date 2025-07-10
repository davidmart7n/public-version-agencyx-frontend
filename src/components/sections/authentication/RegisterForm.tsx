import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useState } from 'react';
import { sendUserRequest } from 'providers/firestore'; // Actualizado para que envíe solicitud con más datos
import { useAuth } from 'providers/AuthProvider';
import Swal from 'sweetalert2';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sector, setSector] = useState('');
  const [message, setMessage] = useState('');

  const { sendRegistrationRequest } = useAuth(); // Esto obtiene la función desde el contexto

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await sendRegistrationRequest(email, password, firstName + ' ' + lastName, sector);

      // Mostrar alerta con check ✔️
      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: 'Tu solicitud está pendiente de validación.',
        confirmButtonText: 'Aceptar',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Ocultar el formulario limpiando campos
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setSector('');
      setMessage('Solicitud enviada y pendiente de validación. Si es aceptada, recibirás un correo de confirmación.');

    } catch (error: any) {
      console.error('Error durante el registro:', error);
      let errorMessage = 'Hubo un error al enviar la solicitud. Inténtalo de nuevo.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está en uso.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };


  return (
    <Box sx={{ mt: { sm: 5, xs: 2.5 } }}>
      {!message && (

        <Stack spacing={3}>
          {/* Campo para Nombre */}
          <TextField
            fullWidth
            variant="outlined"
            label="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {/* Campo para Apellidos */}
          <TextField
            fullWidth
            variant="outlined"
            label="Apellidos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {/* Campo para Email */}
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Campo para Sector */}
          <TextField
            fullWidth
            variant="outlined"
            label="Sector (ej. Finanzas, Marketing)"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
          {/* Campo para Contraseña */}
          <TextField
            fullWidth
            variant="outlined"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-close" color="action.active" />
                    ) : (
                      <IconifyIcon icon="el:eye-open" color="action.focus" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="#!"
            type="submit"
            onClick={handleSubmit}
          >
            Enviar Solicitud
          </Button>
        </Stack>
      )}
      {/* <Divider sx={{ mb: 3 }} /> */}
      {message && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mt={4}
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <Typography variant="h6" color="primary" mb={1} align="center">
            {message}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Gracias por su paciencia.
          </Typography>
        </Box>
      )}



      {/* <Stack spacing={0.5} sx={{ textAlign: 'center', color: 'text.secondary', mb: 1 }}>
          <Typography variant="subtitle1">By creating account, you agree to our</Typography>
          <Link href="#!">
            <Typography color="primary" variant="subtitle1">
              Terms of Service
            </Typography>
          </Link>
        </Stack> */}

      {/* <Divider sx={{ my: 3 }} /> */}
      {/* <Stack spacing={1.5} sx={{ mt: 4 }}>
        <Typography textAlign="center" color="text.secondary" variant="subtitle1">
          Or create an account using:
        </Typography>
        <Button
          startIcon={<IconifyIcon icon="flat-color-icons:google" />}
          sx={{ typography: { sm: 'button', xs: 'subtitle1', whiteSpace: 'nowrap' } }}
          variant="outlined"
        >
          Continue with Google
        </Button>
        <Button
          startIcon={<IconifyIcon icon="logos:facebook" />}
          sx={{ typography: { sm: 'button', xs: 'subtitle1', whiteSpace: 'nowrap' } }}
          variant="outlined"
        >
          Continue with Facebook
        </Button>
      </Stack> */}
    </Box>
  );
};

export default RegisterForm;
