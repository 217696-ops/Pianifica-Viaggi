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

const SmartCardImage = ({ initialSrc, title, fallbackQuery, fallbackDefault }) => {
  const [src, setSrc] = useState(initialSrc);
  const [status, setStatus] = useState('original'); // 'original', 'unsplash', 'error'

  const handleError = async () => {
    // Evitiamo loop se siamo già in stato di errore o abbiamo già caricato Unsplash
    if (status !== 'original') return;

    try {
      const unsplashUrl = await getUnsplashImage(fallbackQuery, fallbackDefault);

      if (unsplashUrl === fallbackDefault) {
        setStatus('error');
        setSrc(fallbackDefault);
      } else {
        setStatus('unsplash');
        setSrc(unsplashUrl);
      }
    } catch (err) {
      setStatus('error');
      setSrc(fallbackDefault);
    }
  };

  // Calcolo dinamico dello stile dell'immagine
  const getFilterStyle = () => {
    if (status === 'unsplash') return 'blur(0px) brightness(1.0)'; // Leggero per Unsplash
    if (status === 'error') return 'blur(3px) brightness(0.7)';    // Forte per Errore
    return 'none';
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '16em', borderRadius: '10px', overflow: 'hidden' }}>
      <img 
        src={src}
        alt={title}
        onError={handleError}
        style={{ 
          objectFit: 'cover', 
          objectPosition: 'center', 
          width: '100%', 
          height: '100%',
          filter: getFilterStyle(),
          transition: 'filter 0.4s ease'
        }} 
      />

      {status !== 'original' && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: '1px',
          pointerEvents: 'none',
          width: '80%',
          // --- LOGICA TESTO DIFFERENZIATA ---
          opacity: status === 'unsplash' ? 0.7 : 1,
          fontSize: status === 'unsplash' ? '0.75rem' : '0.9rem',
          textShadow: status === 'unsplash' 
            ? '1px 1px 4px rgba(0,0,0,0.6)' 
            : '2px 2px 8px rgba(0,0,0,0.9)',
        }}>
          {status === 'unsplash' ? 'Immagine rappresentativa' : 'Immagine non trovata'}
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