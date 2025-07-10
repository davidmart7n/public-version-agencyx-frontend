import { MouseEvent, useState } from "react";
import { MenuItem, Popover } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import IconifyIcon from "components/base/IconifyIcon";
import { useIntlContext } from "providers/IntlProvider"; // Importamos el contexto

const LANGS = [
  { value: "en", label: "English", icon: "flag:gb-4x3" },
  { value: "es", label: "Español", icon: "flag:es-4x3" }
];

const LanguageDropdown = () => {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const { currentLanguage, toggleLanguage } = useIntlContext(); // Usamos el contexto

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ height: 40, width: 40, p: 1 }}>
        <IconifyIcon
          icon={LANGS.find((lang) => lang.value === currentLanguage)?.icon || "flag:gb-4x3"}
          sx={{ width: 28, height: 28, borderRadius: 1 }}
        />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 170 } } }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLanguage}
            onClick={() => {
              toggleLanguage(option.value); // Cambia el idioma
              handleClose();
            }}
            sx={{ typography: "body2", py: 1 }}
          >
            <IconifyIcon icon={option.icon} sx={{ width: 28, height: 28, mr: 2 }} />
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};

export default LanguageDropdown;
