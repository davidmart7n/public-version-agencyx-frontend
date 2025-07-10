import { Box, Button, Stack, Typography } from '@mui/material';
import bg from 'assets/images/illustration.svg';
import Image from 'components/base/Image';
import { FormattedMessage } from 'react-intl';
const SidebarBanner = () => {
  return (
    <Stack direction={'row'} alignItems="center" gap={2} sx={{ my: 0, p: 2 }}>
      <Box
        sx={{
          height: 164,
          width: 1,
          position: 'relative',
          color: 'common.white',
        }}
      >
        <Image
          src={bg}
          alt="illustration"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            zIndex: -1,
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0, // Mueve el contenido a la izquierda
            transform: 'translate(0, -50%)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            ml: '16px', // Añade un margen a la izquierda
            maxWidth: '90%',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            padding: 0, // Reducimos el padding
          }}
        >
          <div>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Maen Studios
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <FormattedMessage id="maenBanner" />
            </Typography>
  
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{
                mt: 1.5,
                alignSelf: 'flex-start',
              }}
              href="https://www.maenstudios.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="readMore" />
            </Button>
          </div>
        </Box>
      </Box>
    </Stack>
  );
  
};

export default SidebarBanner;
