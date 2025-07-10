import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";

export type ContactType = "email" | "phone" | "instagram" | "website" | "whatsapp";

interface Contact {
  type: ContactType;
  value: string;
  link?: string;
}

interface Props {
  initialContacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

const ContactEditable: React.FC<Props> = ({ initialContacts, onChange }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
    onChange(updatedContacts);
  };

  const handleAddContact = () => {
    const newContact: Contact = { type: "email", value: "", link: "" };
    setContacts([...contacts, newContact]);
    onChange([...contacts, newContact]);
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    onChange(updatedContacts);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ pt: 2, textAlign: "left" }}>
        Contacto
      </Typography>
      {contacts.map((contact, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
          {/* Componente Select en vez de TextField */}
          <FormControl size="small" sx={{ mb: 1, maxWidth: 300 }}>
            <InputLabel>Tipo de contacto</InputLabel>
            <Select
             sx={{
                marginTop: 1, // Reducir margen superior
                lineHeight: 1.4, // Ajustar el interlineado
                height: 'auto', // Asegurarse de que el alto se ajuste
              }}
              value={contact.type}
              onChange={(e) => handleContactChange(index, "type", e.target.value as ContactType)}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="website">Website</MenuItem>
              <MenuItem value="whatsapp">Whatsapp</MenuItem>
              
            </Select>
          </FormControl>

          <TextField
            label="Valor del contacto"
            value={contact.value}
            onChange={(e) => handleContactChange(index, "value", e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Enlace (opcional)"
            value={contact.link || ""}
            onChange={(e) => handleContactChange(index, "link", e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          />
          <Button onClick={() => handleRemoveContact(index)} color="error" size="small" sx={{ mt: 1 }}>
            Eliminar contacto
          </Button>
        </Box>
      ))}

      <Button onClick={handleAddContact} variant="outlined" sx={{ mt: 2 }}>
        Añadir nuevo contacto
      </Button>
    </Box>
  );
};

export default ContactEditable;
