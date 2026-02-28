import * as React from 'react';
import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Paper } from '@mui/material';
import { generateCityJSON } from '../services/api';

export default function CityProposer({ db, setDb, setCity }) {
  const [newCityName, setNewCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePropose = async () => {
    if (!newCityName.trim()) return;

    // Formattiamo il nome mettendo la prima lettera maiuscola per estetica
    const formattedCity = newCityName.trim().charAt(0).toUpperCase() + newCityName.trim().slice(1).toLowerCase();

    // Controlliamo se esiste già
    if (db[formattedCity]) {
      setMessage('Questa città è già nel nostro database!');
      setCity(formattedCity); // Lo portiamo direttamente lì
      return;
    }

    setIsLoading(true);
    setMessage(`Sto esplorando ${formattedCity} con l'Intelligenza Artificiale...`);

    const newCityData = await generateCityJSON(formattedCity);

    if (newCityData) {
      // Aggiorniamo il "database" in memoria
      setDb(prevDb => {
        const updatedDb = { ...prevDb, [formattedCity]: newCityData };
        // (Opzionale) Stampa il JSON in console per te, sviluppatore, così puoi copiarlo!
        console.log(`JSON GENERATO PER ${formattedCity}:`, JSON.stringify(newCityData, null, 2));
        return updatedDb;
      });

      setMessage('Città creata con successo!');
      setNewCityName('');
      setCity(formattedCity); // Navighiamo subito alla nuova città!
    } else {
      setMessage('Ops! Qualcosa è andato storto nella generazione. Riprova.');
    }

    setIsLoading(false);
  };

  return (
    <Paper sx={{ p: 2, mb: 2, textAlign: 'center', backgroundColor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Non trovi la tua città preferita? Aggiungila tu!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
        <TextField 
          label="Es. Parigi, Tokyo..." 
          variant="outlined" 
          size="small"
          value={newCityName}
          onChange={(e) => setNewCityName(e.target.value)}
          disabled={isLoading}
        />
        <Button 
          variant="contained" 
          onClick={handlePropose} 
          disabled={isLoading || !newCityName}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Genera Città'}
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
}