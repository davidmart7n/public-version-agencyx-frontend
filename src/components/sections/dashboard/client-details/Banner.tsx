import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface BannerProps {
  currentBanner: string;
  onBannerUpdate: (newBannerUrl: string) => void;
}

const Banner: React.FC<BannerProps> = ({ currentBanner, onBannerUpdate }) => {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 16,
    x: 25,
    y: 25,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);

  useEffect(() => {
    if (currentBanner) {
      setBannerImage(currentBanner);
      setIsNewImage(false);
    }
  }, [currentBanner]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImage(imageUrl);
      setIsNewImage(true);
    }
  };

  const handleImageCrop = async () => {
    if (imageRef && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.clientWidth;
      const scaleY = imageRef.naturalHeight / imageRef.clientHeight;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        await new Promise((resolve) => {
          if (imageRef.complete) resolve(true);
          else imageRef.onload = () => resolve(true);
        });

        const drawX = Math.max(0, crop.x * scaleX);
        const drawY = Math.max(0, crop.y * scaleY);
        const drawWidth = Math.min(crop.width * scaleX, imageRef.naturalWidth - drawX);
        const drawHeight = Math.min(crop.height * scaleY, imageRef.naturalHeight - drawY);

        ctx.drawImage(
          imageRef,
          drawX,
          drawY,
          drawWidth,
          drawHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        setTimeout(() => {
          if (
            canvas.width > 0 &&
            canvas.height > 0 &&
            ctx.getImageData(0, 0, canvas.width, canvas.height).data.length > 0
          ) {
            canvas.toBlob((blob) => {
              if (blob) {
                const croppedImageUrl = URL.createObjectURL(blob);
                onBannerUpdate(croppedImageUrl); // Se pasa la imagen recortada al padre
                setBannerImage(croppedImageUrl); // Actualizamos el estado de la imagen con la recortada
                setIsNewImage(false); // Salimos del modo edición
              }
            }, 'image/png');
          }
        }, 100);
      }
    }
  };

  return (
    <Box py={3}>
      {/* Si ya hay una imagen y no estamos en el modo de edición, mostramos la imagen recortada */}
      {bannerImage && !isNewImage && (
        <img src={bannerImage} alt="Banner" style={{ maxWidth: '100%', maxHeight: '250px' }} />
      )}

      {/* Si estamos en modo de edición (subida de imagen y crop activo) */}
      {isNewImage && bannerImage && (
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          aspect={16 / 5}
          style={{ maxWidth: '100%', maxHeight: '250px' }}
        >
          <img
            src={bannerImage}
            alt="Banner Preview"
            onLoad={(e) => setImageRef(e.target as HTMLImageElement)}
          />
        </ReactCrop>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        id="banner-upload"
      />

      <Box display="flex" justifyContent="start" gap={2} mt={2}>
        <label htmlFor="banner-upload">
          <Button variant="contained" color="primary" component="span">
            Subir nuevo banner
          </Button>
        </label>

        {/* Si estamos en modo de edición, mostramos el botón de confirmar recorte */}
        {isNewImage && (
          <Button variant="contained" color="primary" onClick={handleImageCrop}>
            Confirmar recorte
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Banner;
