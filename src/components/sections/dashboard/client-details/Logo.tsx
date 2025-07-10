import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

interface LogoProps {
  currentLogo: string;
  onLogoUpdate: (newLogoUrl: string) => void;
}

const Logo: React.FC<LogoProps> = ({ currentLogo, onLogoUpdate }) => {
  const [logoImage, setLogoImage] = useState<string | null>(currentLogo);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogoImage(imageUrl);
      onLogoUpdate(imageUrl); // Se envía directamente al padre
    }
  };

  return (
    <Box py={3}>
      {logoImage && (
        <img src={logoImage} alt="Logo" style={{ maxWidth: '150px', maxHeight: '150px' }} />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        id="logo-upload"
      />

      <Box display="flex" justifyContent="start" mt={2}>
        <label htmlFor="logo-upload">
          <Button variant="contained" color="primary" component="span">
            Subir nuevo logo
          </Button>
        </label>
      </Box>
    </Box>
  );
};

export default Logo;
