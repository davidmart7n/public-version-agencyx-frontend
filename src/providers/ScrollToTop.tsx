// src/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Esto restablece el scroll a la parte superior de la página
  }, [location]);

  return null; // No necesitas renderizar nada
};

export default ScrollToTop;
