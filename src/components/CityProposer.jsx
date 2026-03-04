import * as React from 'react';
import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Paper } from '@mui/material';
import { generateCityJSON } from '../services/api';
import Meteo from "./Meteo"; 

const token = "8cd95670411e3573574d297cfecc7537";

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

      // Controlliamo se esiste il Meteo
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${formattedCity},${JSON.stringify(newCityData, null, 2)["nazione"]}&APPID=${token}`
        );
        const output = await response.json();
        if(output["cod"] == 200) {
          //console.log('Città creata con successo!', output["cod"]);
          setDb(prevDb => {
            const updatedDb = { ...prevDb, [formattedCity]: newCityData };
            // (Opzionale) Stampa il JSON in console per te, sviluppatore, così puoi copiarlo!
            console.log(`JSON GENERATO PER ${formattedCity}:`, JSON.stringify(newCityData, null, 2));
            setCity(formattedCity); // Navighiamo subito alla nuova città!
            return updatedDb;
          });
        } else {
          setMessage('Mi dispiace, non ho trovato la città che mi hai chiesto');
          setNewCityName('');
          console.log('Questa città non esiste!', output["cod"]);
          setIsLoading(false);
          return;
        }
        
      }catch (e) {
        setMessage('Mi dispiace, non ho trovato la città che mi hai chiesto');
        setNewCityName('');
        console.log('Questa città non esiste!', output);
        setIsLoading(false);
        return;
      }
    setIsLoading(false);
  };

  return (
    <Box style={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Non trovi la tua città preferita? Aggiungila tu!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
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
    </Box>
  );
}