import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useUsers } from 'providers/UsersProvider';
import {
  getAuth,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';


interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | undefined;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, userId }) => {
  const { users, updateUser } = useUsers();
  const userToEdit = users.find((u) => u.id === userId);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('');

  const [emailError, setEmailError] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Muestra el campo de re-autenticación en cuanto el email difiere
  const [requireReauth, setRequireReauth] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState<string>('');

  // Al abrir el modal, cargamos valores iniciales
  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.fullName);
      setEmail(userToEdit.email);
      setSector(userToEdit.sector);
      setEmailError('');
      setRequireReauth(false);
      setReauthPassword('');
      setReauthError('');
    }
  }, [userToEdit]);

  const validateEmail = (value: string) => {
    setEmailError(!EMAIL_REGEX.test(value) ? 'Formato de correo no válido' : '');
  };

  const handleSave = async () => {
    validateEmail(email);
    if (emailError || !userId) return;

    setSaving(true);
    try {
      // 1) Siempre actualizamos nombre y sector en Firestore
      await updateUser(userId, { fullName, sector });

      const auth = getAuth();
      const me = auth.currentUser;

      // 2) Si soy yo mismo y el email cambió, reenrutamos reauth+verify
      if (me?.uid === userId && me.email !== email) {
        if (!requireReauth) {
          // Esto no debería pasar porque mostramos el campo al cambiar email
          setRequireReauth(true);
          return;
        }
        // 2a) Reautenticación con la contraseña introducida
        const cred = EmailAuthProvider.credential(me.email!, reauthPassword);
        await reauthenticateWithCredential(me, cred);

        // 2b) Envío del correo de verificación al nuevo email
        await verifyBeforeUpdateEmail(me, email);

        setEmailError('🚀 Revisa tu nuevo correo y confirma el cambio.');
        return; // no cerramos hasta que confirme
      }

      // 3) Si no cambié (o ya confirmé antes), cerramos
      onClose();
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      setEmailError('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => {
            const newEmail = e.target.value;
            setEmail(newEmail);
            validateEmail(newEmail);
            // Mostramos/ocultamos el campo de reauth
            if (userToEdit) {
              setRequireReauth(newEmail !== userToEdit.email);
              setReauthError('');       // reseteamos error al editar
              setReauthPassword('');    // limpiamos password si vuelve a editar
            }
          }}
          error={Boolean(emailError)}
          helperText={emailError}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          fullWidth
          margin="normal"
        />

        {requireReauth && (
          <Box mt={2}>
            <TextField
              label="Contraseña actual"
              type="password"
              value={reauthPassword}
              onChange={(e) => {
                setReauthPassword(e.target.value);
                setReauthError('');
              }}
              error={Boolean(reauthError)}
              helperText={reauthError || 'Introduce tu contraseña para confirmar el nuevo email'}
              fullWidth
              margin="normal"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          sx={{
            ...(saving ||
            Boolean(emailError) ||
            (requireReauth && !reauthPassword)
              ? { opacity: 0.5, pointerEvents: 'none' }
              : {}),
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;