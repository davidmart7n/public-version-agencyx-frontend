import { Box, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './footer/Footer';
import MainNavbar from './navbar/MainNavbar';
import Sidebar from './sidebar/Sidebar';
import { useLocation } from 'react-router-dom';


const drawerWidth = 270;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  const [drawerLocked, setDrawerLocked] = useState(false); // ⬅️ nuevo candado
  const [lastRouteChange, setLastRouteChange] = useState<number>(Date.now());

  useEffect(() => {
    setLastRouteChange(Date.now());
  
    if (!mobileOpen) return; // ⛔ Si el Drawer no está abierto, no hagas nada
  
    setDrawerLocked(true);
    setMobileOpen(false);
  
    const timeout = setTimeout(() => {
      setDrawerLocked(false);
    }, 350);
  
    return () => clearTimeout(timeout);
  }, [location.pathname]);
  
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus(); // 🔥 restaura el foco al body
    }, 0);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    const now = Date.now();
    if (drawerLocked || now - lastRouteChange < 200) return; // evita el amague
  
    setDrawerLocked(true);
    setMobileOpen((prev) => !prev);
  
    setTimeout(() => setDrawerLocked(false), 350);
  };
  
  
  

  return (
    <Stack
      sx={{
        minHeight: '100vh', // Hace que el layout ocupe toda la pantalla
        position: 'relative',
        flexDirection: 'row',
        width: 1,
      }}
    >
      <Sidebar
        onDrawerClose={handleDrawerClose}
        onDrawerTransitionEnd={handleDrawerTransitionEnd}
        mobileOpen={mobileOpen}
      />

      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          flexGrow: 1,
          width: 1,
          maxWidth: { xs: 1, lg: `calc(100% - ${drawerWidth}px)` },
          justifyContent: 'space-between',
          minHeight: '100vh', // Asegura que el contenido llene la pantalla
          padding: 0, // Ajusta el padding aquí para reducir los márgenes
        }}
      >
        <MainNavbar onDrawerToggle={handleDrawerToggle} />

        {/* Contenedor del contenido con flexGrow para empujar el Footer */}
        <Container
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 0, margin: 0 }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {' '}
            {/* Empuja el footer hacia abajo */}
            <Outlet />
          </Box>
        </Container>

        <Footer />
      </Stack>
    </Stack>
  );
};

export default MainLayout;