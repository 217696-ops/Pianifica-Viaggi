import { styled } from '@mui/material/styles';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { getRegioni, getCitta, getCittaByRegione } from '../utils/helpers';
import { getUnsplashImage } from '../services/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

  // Helper per renderizzare card standard (Home, Regioni, Attrazioni)
  const renderCard = (title, imagePath, fallbackQuery, fallbackDefault, onClick) => (
    <Grid item xs={6} sm={4} key={title} onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Item>
        <img 
          src={imagePath}
          alt={title}
          style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
          onError={async (e) => {
            e.target.onerror = null;
            e.target.src = await getUnsplashImage(fallbackQuery, fallbackDefault);
          }}
        />         
        <Typography>{title}</Typography>
      </Item>  
    </Grid>
  );

  const renderContent = () => {
    // 1. Home (Nessuna selezione)
    if (!city) {
      return getCitta(db).sort().map(c => 
        renderCard(c, `../${c}/home.jpg`, c, '../cityImage.jpg', () => handleClickCity(c))
      );
    }

    // 2. Regione Selezionata
    if (elenco_regioni.includes(city)) {
      return getCittaByRegione(db, city).sort().map(c => 
        renderCard(c, `../${c}/home.jpg`, c, '../cityImage.jpg', () => handleClickCity(c))
      );
    }

    // // 3. Vista Cibo (Con link a Google Maps)
    // if (pagina === 'cibo') {
    //   return db[city]['cibo'].sort().map((cibo, index) => (
    //     <Grid item xs={6} sm={4} key={index}>
    //       <a 
    //         style={{ textDecoration: 'none', color: 'inherit' }} 
    //         href={`https://www.google.com/maps/search/?api=1&query=${cibo}+${city}`} 
    //         target="_blank" 
    //         rel="noreferrer"
    //       >
    //         <Item sx={{ cursor: 'pointer' }}>
    //           <img 
    //               src={`../${city}/${cibo}.jpg`}
    //               alt={cibo}
    //               style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
    //               onError={async (e) => {
    //                 e.target.onerror = null;
    //                 // Se getImageUrl non è definita, usa getUnsplashImage come nelle altre sezioni
    //                 e.target.src = await getUnsplashImage(cibo, '../foodImage.jpg');
    //               }}
    //           />
    //           <Typography>{cibo}</Typography>
    //         </Item>
    //       </a>
    //     </Grid>
    //   ));
    // }

    // // 4. Vista Attrazioni (Default)
    // if (pagina === 'attrazioni') {
    //   return Object.keys(db[city]["attrazioni"]).sort().map(attr => 
    //     renderCard(attr, `../${city}/${attr}.jpg`, attr, '../attractionImage.jpg', () => handleClickAttraction(attr))
    //   );
    // }

    // return null;

    // 3. Città selezionata -> Vista Cibo
    if (pagina === 'cibo') {
      return Object.keys(db[city]['cibo']).sort().map(ciboItem => 
        renderCard(ciboItem, `../${city}/${ciboItem}.jpg`, ciboItem, '../foodImage.jpg', () => handleClickFood(ciboItem))
      );
    }

    // 4. Città selezionata -> Vista Attrazioni (Default)
    return Object.keys(db[city]["attrazioni"]).sort().map(attr => 
      renderCard(attr, `../${city}/${attr}.jpg`, attr, '../attractionImage.jpg', () => handleClickAttraction(attr))
    );
    
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Il Container deve SEMPRE avvolgere i Grid Item */}
      <Grid container spacing={1}>
        {renderContent()}
      </Grid>
    </Box>
  );
}