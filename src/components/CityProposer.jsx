import * as React from 'react';
import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Paper } from '@mui/material';
import { generateCityJSON } from '../services/api';
import Meteo from "./Meteo"; 

const token = import.meta.env.VITE_WEATHER_TOKEN;
const generazione_token = import.meta.env.VITE_FORMSPREE_GENERAZIONE_TOKEN;

export default function CityProposer({ db, setDb, setCity }) {
  const [newCityName, setNewCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePropose = async () => {
    if (!newCityName.trim()) return;

    // Formattiamo il nome mettendo la prima lettera maiuscola per estetica
    const formattedCity = newCityName
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Lista di particelle che preferiamo mantenere minuscole (opzionale)
      const lowerCaseWords = ["da", "de", "di", "do", "du", "dallo", "dalle", "delle", "degli", "del", "del", "dello", "a", "al", "alle", "agli", "in", "nel", "nella", "nelle", "negli", "con", "per", "tra", "fra"];

      if (index > 0 && lowerCaseWords.includes(word)) {
        return word;
      }

      // Capitalizza la prima lettera di ogni parola
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

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
          console.log('Città non trovata!', output["cod"]);
          setIsLoading(false);
          return;
        }
        
      }catch (e) {
        setMessage('Mi dispiace, non ho trovato la città che mi hai chiesto');
        setNewCityName('');
        console.log('Città non trovata!', output);
        setIsLoading(false);
        return;
      }
    setIsLoading(false);

    // Registro la città nel database
    if (newCityData) {
      // 1. Aggiorni l'interfaccia utente (come abbiamo già fatto)
      setDb(prevDb => ({ ...prevDb, [formattedCity]: newCityData }));

      // 2. INVII I DATI AL TUO ARCHIVIO PERSONALE SILENZIOSAMENTE
      try {
        await fetch(`https://formspree.io/f/${generazione_token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            CittaRichiesta: formattedCity,
            DataRichiesta: new Date().toLocaleString(),
            JSON_Pronto: newCityData 
          })
        });
        // console.log("Dati inviati con successo in archivio!");
      } catch (err) {
        // console.error("Errore nell'invio dei log:", err);
      }

      // 3. Mostri il messaggio di successo all'utente
      setMessage('Città creata con successo!');
      setNewCityName('');
      setCity(formattedCity);
    }
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
          sx={{ 
            whiteSpace: 'nowrap', 
            minWidth: 'max-content'
          }}
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