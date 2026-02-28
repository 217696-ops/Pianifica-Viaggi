import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Typography, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Meteo from "./Meteo"; // Assumendo che esista già e non lo tocchiamo
import { creaLinkGoogleMaps, getRandomCitazione } from "../utils/helpers";
import { fetchCityDescription, fetchAttractionDescription, fetchFoodDescription, getUnsplashImage } from "../services/api";

export default function CityDescription({ city, pagina, attrazione, food, setPagina, db }) {
  const [aiCityDesc, setAiCityDesc] = useState("");
  const [aiAttrDesc, setAiAttrDesc] = useState("");
  const [aiFoodDesc, setAiFoodDesc] = useState("");
  const [date, setDate] = useState("Oggi");
  const randomQuote = React.useMemo(() => getRandomCitazione(), [city]); // Cambia citazione solo quando si torna alla home

  // Fetch City AI Description
  useEffect(() => {
    if (city && db[city] && (!db[city]["descrizione"] || db[city]["descrizione"] === "Descrizione")) {
      setAiCityDesc(`Mistral AI, il massimo esperto di viaggi, sta elaborando la miglior descrizione per ${city}...`); // Messaggio di attesa
      fetchCityDescription(city).then(setAiCityDesc);
    }
  }, [city, db]);

  // Fetch Attraction AI Description
  useEffect(() => {
    if (city && attrazione && (!db[city]["attrazioni"][attrazione] || db[city]["attrazioni"][attrazione] === "Descrizione")) {
      setAiAttrDesc(`Mistral AI, il massimo esperto di viaggi, sta elaborando la miglior descrizione per ${attrazione}...`); // Messaggio di attesa
      fetchAttractionDescription(city, attrazione).then(setAiAttrDesc);
    }
  }, [city, attrazione, db]);

  // Fetch Food AI Description
  useEffect(() => {
    if (city && food && (!db[city]["cibo"][food] || db[city]["cibo"][food] === "Descrizione")) {
      setAiFoodDesc(`Mistral AI, il massimo esperto di cucina, sta elaborando la miglior descrizione per ${food}...`); // Messaggio di attesa
      fetchFoodDescription(city, food).then(setAiFoodDesc);
    }
  }, [city, food, db]);

  // --- LOGICA DI RENDER ---

  // 1. Vista Dettaglio Attrazione
  if (attrazione) {
    const descText = (db[city]["attrazioni"][attrazione] === "Descrizione" || !db[city]["attrazioni"][attrazione]) 
      ? aiAttrDesc : db[city]["attrazioni"][attrazione];

    return (
      <Box>
        <a style={{ textDecoration: 'none', color: 'inherit' }} href={`https://www.google.com/maps/search/?api=1&query=${attrazione}+${city}`} target="_blank" rel="noreferrer">
          <img 
              src={`../${city}/${attrazione}.jpg`}
              alt={attrazione}
              style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
              onError={async (e) => {
                e.target.onerror = null;
                e.target.src = await getUnsplashImage(attrazione, '../attractionImage.jpg');
              }}
          />
        </a>
        <Typography style={{ textAlign: "left", marginTop: '1em' }}>{descText}</Typography>
      </Box>
    );
  }

  // 2. Vista Dettaglio Cibo
  if (food) {
    const descText = (db[city]["cibo"][food] === "Descrizione" || !db[city]["cibo"][food]) 
      ? aiFoodDesc : db[city]["cibo"][food];

    return (
      <Box>
        <a style={{ textDecoration: 'none', color: 'inherit' }} href={`https://www.google.com/maps/search/?api=1&query=${food}+${city}`} target="_blank" rel="noreferrer">
          <img 
              src={`../${city}/${food}.jpg`}
              alt={food}
              style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
              onError={async (e) => {
                e.target.onerror = null;
                e.target.src = await getUnsplashImage(food, '../foodImage.jpg');
              }}
          />
        </a>
        <Typography style={{ textAlign: "left", marginTop: '1em' }}>{descText}</Typography>
      </Box>
    );
  }

  // 3. Vista Dettaglio Città
  if (city) {
    const descText = (db[city]["descrizione"] === "Descrizione" || !db[city]["descrizione"]) 
      ? aiCityDesc : db[city]["descrizione"];

    return (
      <Box>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'left', margin: 0 }}> {city} </h1>
          <a href={`https://guide.michelin.com/it/it/ristoranti?q=${city}&sort=lowestPrice`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
            <RestaurantIcon fontSize="medium"/>
          </a>
        </Box>

        <a href={creaLinkGoogleMaps(Object.keys(db[city]["attrazioni"]).sort(), city)} target="_blank" rel="noreferrer">
          <img
            src={`../${city}/home.jpg`}
            alt={city}
            style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "20em", borderRadius: "10px", marginTop: "0.5em" }}
            onError={async (e) => {
              e.target.onerror = null;
              e.target.src = await getUnsplashImage(city, '../cityImage.jpg');
            }}
          />
        </a>

        <Typography style={{ textAlign: "left", marginTop: '1em' }}>{descText}</Typography>

        <Box marginBottom={1} marginTop={2} sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="select-meteo-label">Meteo</InputLabel>
            <Select labelId="select-meteo-label" value={date} label="Meteo" onChange={(e) => setDate(e.target.value)}>
              <MenuItem value={"Oggi"}>Oggi</MenuItem>
              <MenuItem value={"Domani"}>Domani</MenuItem>
              <MenuItem value={"Dopodomani"}>Dopodomani</MenuItem>
              <MenuItem value={"IlGiornoDopo"}>Il Giorno Dopo</MenuItem>
              <MenuItem value={"IlGiornoDopoAncora"}>Il Giorno Dopo Ancora</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Meteo city={city} date={date} db={db} />
      </Box>
    );
  }

  // 4. Vista Home (Niente selezionato o Regione selezionata)
  return (
    <Box style={{ width: "100%" }}>
      <img
        src={"../default.jpg"}
        alt="Home"
        style={{ objectFit: "cover", objectPosition: "center", width: "100%", minHeight: "18em", borderRadius: "10px", marginTop: "0.5em" }}
      />
      <Typography style={{ textAlign: "left", width: "100%", marginTop: '1em' }}>
        "{randomQuote.citazione}"<br/> <i>{randomQuote.autore}</i>
      </Typography>
    </Box>
  );
}