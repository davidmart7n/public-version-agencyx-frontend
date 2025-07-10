import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { auth, firestore } from 'providers/firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';
import { getDoc, doc } from 'firebase/firestore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado de error
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reseteamos el error antes de hacer login

    try {
      // Inicia sesión con las credenciales del usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificamos si el usuario existe en Firestore
      const userDoc = await getDoc(doc(firestore, "users", user.uid));


      // Comprobamos el estado del usuario
      const userStatus = userDoc.data()?.status;
      if (userStatus === "pending") {
        // Si el estado es "pending", mostramos un error y prevenimos el login
        setError("Tu cuenta está pendiente de validación. No puedes iniciar sesión.");
        return; // Salir de la función para no continuar con el login
      }


      // Si el usuario está activo y validado, procedemos con el login
      console.log("Login exitoso");
      navigate("/"); // Redirigir al inicio si el login es exitoso
      window.location.reload();

    } catch (error: any) {
      console.error("Login error:", error.message);

      let errorMessage = 'Ha ocurrido un error inesperado. Intenta nuevamente.';

      if (
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/missing-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'Credenciales no válidas.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setTimeout(() => setError(errorMessage), 0); // ⬅️ Aseguramos actualización del estado
    }
  };


  return (
    <Box sx={{ mt: { sm: 4.5, xs: 2.5 } }}>
      {/* Mostramos la alerta si hay un error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          inputProps={{
            style: {
              lineHeight: '1.4', // Mejora la altura de las líneas para mayor legibilidad
            },
          }}
       
        />
        <TextField
          fullWidth
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: {
              lineHeight: '1.4', // Mejora la altura de las líneas para mayor legibilidad
            },
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
      </Stack>

      <FormGroup sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox />}
          label="Mantener sesión iniciada"
          sx={{ color: 'text.secondary' }}
        />
      </FormGroup>

      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        onClick={handleLogin}
      >
        Acceder
      </Button>

      {/* Mostramos el error si está presente */}
      {/* {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
          Invalid user credentials
        </Typography>
      )} */}

      {/* <Stack sx={{ textAlign: 'center', color: 'text.secondary', my: 3 }}>
        <Link to={'/authentication/forgot-password'}>
          <Typography color="primary" variant="subtitle1">
            Forgot Your Password?
          </Typography>
        </Link>
      </Stack> */}

      {/* <Divider sx={{ my: 3 }} />

      <Stack spacing={1.5} sx={{ mt: 4 }}>
        <Typography textAlign="center" color="text.secondary" variant="subtitle1">
          Or sign in using:
        </Typography>
        <Button
          startIcon={<IconifyIcon icon="flat-color-icons:google" />}
          variant="outlined"
          sx={{ typography: { sm: 'button', xs: 'subtitle1', whiteSpace: 'nowrap' } }}
        >
          Continue with Google
        </Button>
        <Button
          startIcon={<IconifyIcon icon="logos:facebook" />}
          variant="outlined"
          sx={{ typography: { sm: 'button', xs: 'subtitle1', whiteSpace: 'nowrap' } }}
        >
          Continue with Facebook
        </Button>
      </Stack> */}
    </Box>
  );
};

export default LoginForm;
