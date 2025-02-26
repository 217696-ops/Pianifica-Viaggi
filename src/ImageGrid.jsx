import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const AccessKey = "b5CJx4NyEPDM9qyrKuxo2fheWCsR5mTEcN5Onb3CH8o";
const SecretKey = "kJXk2RlmkkLJkyBr161RBCIqQjS5C6ZvbfDJ4jJG7yw";

// selezione attrazione e creazione percorso
// https://www.google.com/maps/dir/Colosseo/Pantheon/Vaticano

async function getImageUrl(pagina, city, attraction) {
  // Sono in una città, quindi ricerco le attrazioni
  if(city != '') {
    if(pagina == 'attrazioni') {
      try {
        const immagine = attraction ;//+ '+' + city;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${immagine}&client_id=${AccessKey}`);
        const output = await response.json();
        console.log(output);
        // da 0 a 9
        const URL_immagine = output.results[0].urls.regular;
        // console.log(URL_immagine);
        return URL_immagine
      } catch (e) {
        return `../public/attractionImage.jpg`;
      }
    } else {
      try {
        const immagine = attraction ;//+ '+' + city;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${immagine}&client_id=${AccessKey}`);
        const output = await response.json();
        console.log(output);
        // da 0 a 9
        const URL_immagine = output.results[0].urls.regular;
        // console.log(URL_immagine);
        return URL_immagine
      } catch (e) {
        return `../public/foodImage.jpg`;
      }
    }
  } 
  // Sono nella home page, quindi ricerco le città
  else {
      try {
        const immagine = attraction ;//+ '+' + city;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${immagine}&client_id=${AccessKey}`);
        const output = await response.json();
        console.log(output);
        // da 0 a 9
        const URL_immagine = output.results[0].urls.regular;
        // console.log(URL_immagine);
        return URL_immagine
      } catch (e) {
        return `../public/cityImage.jpg`;
      }
    }
}

export default function ImageGrid({city, setCity, pagina, db}) {

  // Setto lo stato 
  function handleClick (attrazione) {
      setCity(attrazione);
  };

  // Prendo lista città
  const citta = Object.keys(db);
  citta.sort();
  if (city != "") db[city]["attrazioni"].sort();
  // Prendo lista cibo
  const cibo = Object.keys(db);
    cibo.sort();
  if (city != "") db[city]["cibo"].sort();

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        {/* Elenco Attrazioni */}
        {city != '' ? (
          pagina == 'cibo' ? (
            db[city]['cibo'].map((cibo, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <a style={{ textDecoration: 'none', color: 'inherit' }} 
                  href={`https://www.google.com/maps/search/?api=1&query=${cibo}+${city}`} target="_blank">
                  <Item>
                    <img 
                        src={`../public/${city}/${cibo}.jpg`}
                        alt={cibo}
                        style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
                        onError={async (e) => {
                          e.target.onerror = null;
                          e.target.src = await getImageUrl(pagina, city, cibo);
                        }}
                    />
                    <Typography>{cibo}</Typography>
                  </Item>
                </a>
              </Grid>
            ))
          ):(
            db[city]["attrazioni"].map((attrazione, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <a style={{ textDecoration: 'none', color: 'inherit' }} 
                  href={`https://www.google.com/maps/search/?api=1&query=${attrazione}+${city}`} target="_blank">
                  <Item>
                    <img 
                        src={`../public/${city}/${attrazione}.jpg`}
                        alt={attrazione}
                        style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
                        onError={async (e) => {
                          e.target.onerror = null;
                          e.target.src = await getImageUrl(pagina, city, attrazione);
                        }}
                    />
                    <Typography>{attrazione}</Typography>
                  </Item>
                </a>
              </Grid>
            ))
          )
        ):(
          citta.map((city, index) => (
            <Grid item xs={6} sm={4} key={index} onClick={() => handleClick(city)}>
              {/* Elenco Città */}
              <Item>
                  <img 
                    src={`../public/${city}/home.jpg`}
                    alt={city}
                    style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
                    onError={async (e) => {
                        e.target.onerror = null;
                        e.target.src= await getImageUrl(pagina, '',city);
                    }}
                  />         
                <Typography>{city}</Typography>
              </Item>  
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}