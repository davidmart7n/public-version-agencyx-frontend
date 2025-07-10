import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Box, CircularProgress } from '@mui/material';


interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, authLoading } = useAuth(); // Estado de autenticación

  // Mientras Firebase está cargando, mostramos un loader
  if (authLoading) {
    
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
    </Box>;
  }

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/authentication/login" state={{ pendingApproval: false }} />;
  }

  // Si el usuario está en estado "pending", redirige con un flag especial
  if (user.status === "pending") {
    return <Navigate to="/authentication/login" state={{ pendingApproval: true }} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
