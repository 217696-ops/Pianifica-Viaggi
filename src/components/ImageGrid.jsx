import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { getRegioni, getCitta, getCittaByRegione, getDefaultImage } from '../utils/helpers';
import { getUnsplashImage } from '../services/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  position: 'relative', // Necessario per posizionare il badge
  overflow: 'hidden'
}));

// Sotto-componente per gestire la logica asincrona e il badge
const SmartCardImage = ({ initialSrc, title, fallbackQuery, fallbackDefault }) => {
  const [src, setSrc] = useState(initialSrc);
  const [showBadge, setShowBadge] = useState(false);

  const handleError = async () => {
    if (showBadge) return;

    const unsplashUrl = await getUnsplashImage(fallbackQuery, fallbackDefault);

    if (unsplashUrl === fallbackDefault) {
      setShowBadge(true);
    }

    setSrc(unsplashUrl);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '16em', borderRadius: '10px', overflow: 'hidden' }}>
      <img 
        src={src}
        alt={title}
        style={{ 
          objectFit: 'cover', 
          objectPosition: 'center', 
          width: '100%', 
          height: '100%',
          // SFOCATURA: si attiva solo se mostriamo il badge
          filter: showBadge ? 'blur(4px) brightness(0.7)' : 'none',
          transition: 'filter 0.3s ease' // Rende l'effetto più fluido
        }} 
        onError={handleError}
      />

      {showBadge && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // BADGE PULITO: senza bordi, solo testo bianco con ombra per leggibilità
          color: 'white',
          textAlign: 'center',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)', // Ombra per leggere il testo sul blur
          pointerEvents: 'none',
          width: '80%'
        }}>
          Immagine non trovata
        </Box>
      )}
    </Box>
  );
};

export default function ImageGrid({city, setCity, attrazione, setAttrazione, food, setFood, pagina, db}) {
  const elenco_regioni = getRegioni(db);

  const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const handleClickCity = (nomeCitta) => {
    setCity(nomeCitta);
    scrollToTop();
  };

  const handleClickAttraction = (nomeAttrazione) => {
    setAttrazione(nomeAttrazione);
    scrollToTop();
  };

  const handleClickFood = (nomeFood) => {
    setFood(nomeFood);
    scrollToTop();
  };

  // Helper aggiornato per usare SmartCardImage
  const renderCard = (title, imagePath, fallbackQuery, fallbackDefault, onClick) => (
    <Grid item xs={6} sm={4} key={title} onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Item>
        <SmartCardImage 
          initialSrc={imagePath} 
          title={title} 
          fallbackQuery={fallbackQuery} 
          fallbackDefault={fallbackDefault} 
        />
        <Typography sx={{ mt: 1 }}>{title}</Typography>
      </Item>  
    </Grid>
  );

  const renderContent = () => {
    if (!city) {
      return getCitta(db).sort().map(c => 
        renderCard(c, `../${c}/home.jpg`, c, getDefaultImage("citta", db[c]["regione"]), () => handleClickCity(c))
      );
    }

    if (elenco_regioni.includes(city)) {
      return getCittaByRegione(db, city).sort().map(c => 
        renderCard(c, `../${c}/home.jpg`, c, getDefaultImage("citta", db[c]["regione"]), () => handleClickCity(c))
      );
    }

    if (pagina === 'cibo') {
      return Object.keys(db[city]['cibo']).sort().map(ciboItem => 
        renderCard(ciboItem, `../${city}/${ciboItem}.jpg`, ciboItem, getDefaultImage("cibo", db[city]["regione"]), () => handleClickFood(ciboItem))
      );
    }

    return Object.keys(db[city]["attrazioni"]).sort().map(attr => 
      renderCard(attr, `../${city}/${attr}.jpg`, attr, getDefaultImage("attrazione", db[city]["regione"]), () => handleClickAttraction(attr))
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        {renderContent()}
      </Grid>
    </Box>
  );
}