import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Divider, Box, TextField, Snackbar, InputAdornment, IconButton } from "@mui/material";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; // Importa las funciones de Firebase
import { auth } from "providers/firebaseConfig"; // Importa tu configuración de Firebase
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getAuth } from "firebase/auth"; // Importa getAuth de Firebase
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegación
import Swal from "sweetalert2"; // Importa SweetAlert2
import { useUsers } from "providers/UsersProvider"; // Importa el contexto de usuarios
import { FormattedMessage } from "react-intl";

const Account = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); // Para manejar errores
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Para manejar mensajes de éxito
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false); // Para mostrar el snackbar
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña actual
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false); // Estado para mostrar/ocultar nueva contraseña
    const { deleteUser, currentUser } = useUsers(); // Obtener la función deleteUser desde el contexto

    const navigate = useNavigate(); // Hook para navegar a otras rutas
    const userId = currentUser?.id; // Obtener el ID del usuario

    const handlePasswordChange = async () => {
        // Limpiar mensajes previos al iniciar un nuevo intento
        setError(null);
        setSuccessMessage(null);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No user is currently logged in.");
            }

            // Reautenticar al usuario con la contraseña actual
            const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
            await reauthenticateWithCredential(user, credential); // Verifica la contraseña actual

            // Si la reautenticación es exitosa, actualizamos la contraseña
            await updatePassword(user, newPassword); // Cambia la contraseña con la nueva

            // Mensaje de éxito
            setSuccessMessage("Contraseña cambiada correctamente.");
            setNewPassword("");
            setCurrentPassword("");
            setOpenSnackbar(true);
        } catch (error: any) {
            let errorMessage = "Ocurrió un error al cambiar la contraseña.";

            // Maneja los errores según los códigos de Firebase
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

            setError(errorMessage); // Establece el mensaje de error
        }
    };

    const handleAccountDeletion = () => {
        // Usar SweetAlert2 para confirmación antes de eliminar la cuenta
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar cuenta",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteUser(); // Llamar la función de eliminación si se confirma
            }
        });
    };

    const handleDeleteUser = () => {
        if (userId) {
            // Llama a la función de deleteUser desde el contexto
            deleteUser(userId).then(() => {
                Swal.fire("Cuenta eliminada", "Tu cuenta ha sido eliminada con éxito", "success");
                navigate("/authentication/login"); // Redirige al usuario a la página de login después de la eliminación
            }).catch((error) => {
                Swal.fire("Error", "Ocurrió un error al eliminar la cuenta. Intenta nuevamente.", "error");
            });
        }
    };

    const handleLogout = () => {
        const auth = getAuth();
        auth.signOut(); // Cierra sesión
        navigate("/authentication/login"); // Redirige al usuario a la página de login
    };

    return (
        <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🧑‍💻 <FormattedMessage id="account" />
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Cambiar Contraseña */}
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <FormattedMessage id="changePassword" />
                </Typography>

                {/* Mostrar errores si existen */}
                {error && <Typography color="error">{error}</Typography>}
                {successMessage && <Typography color="success">{successMessage}</Typography>}

                <TextField
                    label={<FormattedMessage id="currentPassword" />}
                    type={showCurrentPassword ? "text" : "password"}
                    fullWidth
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    edge="end"
                                >
                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label={<FormattedMessage id="newPassword" />}
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                    <FormattedMessage id="changePassword" />
                </Button>

                {/* Cerrar sesión */}
                <Box mt={3}>
                    <Button variant="outlined" color="primary" onClick={handleLogout}>
                        <FormattedMessage id="logout" />
                    </Button>
                </Box>

                {/* Eliminar cuenta */}
                <Box mt={3}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleAccountDeletion}
                        disabled={isDeletingAccount}
                    >
                       <FormattedMessage id="deleteAccount" />
                    </Button>
                </Box>
            </CardContent>

            {/* Snackbar para mostrar mensajes */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                message={successMessage}
                onClose={() => setOpenSnackbar(false)}
            />
        </Card>
    );
};

export default Account;
