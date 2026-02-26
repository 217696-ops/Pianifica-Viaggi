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
        // da 0 a 9
        const URL_immagine = output.results[0].urls.regular;
        // console.log(URL_immagine);
        return URL_immagine
      } catch (e) {
        return `../attractionImage.jpg`;
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
        return `../foodImage.jpg`;
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
        return `../cityImage.jpg`;
      }
    }
}

export default function ImageGrid({city, setCity, attrazione, setAttrazione, pagina, db}) {

  // Setto la città selezionata
  function handleClick (setCitta) {
    setCity(setCitta);
    window.scrollTo({
      top: 0, 
      left: 0, 
      behavior: 'smooth' // 'smooth' per uno scorrimento fluido, 'auto' per salto istantaneo
    });
  };
  // Setto la città selezionata
  function handleClickAttrazione (setAtt) {
    setAttrazione(setAtt);
    setCity(city);
    // attrazione = setAtt;
    window.scrollTo({
      top: 0, 
      left: 0, 
      behavior: 'smooth' // 'smooth' per uno scorrimento fluido, 'auto' per salto istantaneo
    });
  };

  // Prendo lista città
  const citta = Object.keys(db);
  citta.sort();
  //if (city != "") db[city]["attrazioni"].sort();
  // Prendo lista cibo
  const cibo = Object.keys(db);
  cibo.sort();
  //if (city != "") db[city]["cibo"].sort();
  // Prendo lista regioni
  const tutte_regioni = Object.values(db).map(citta => citta.regione);
  const elenco_regioni = [...new Set(tutte_regioni)];
  elenco_regioni.sort();
  // Città in regioni
  const citta_regione = Object.keys(db).sort().filter(nomeCitta => db[nomeCitta].regione === city);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        {
          /* è stata selezionata una regione */
          elenco_regioni.includes(city) ? (
            citta_regione.map((city, index) => (
              <Grid item xs={6} sm={4} key={index} onClick={() => handleClick(city)}>
                {/* Elenco Città */}
                <Item>
                    <img 
                      src={`../${city}/home.jpg`}
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
          ):(
          /* è stata selezionata una città */
          city != '' ? (
            Object.keys(db[city]["attrazioni"]).includes(attrazione) ? (
              /* Elenco attrazioni */
              Object.keys(db[city]["attrazioni"]).map((attrazione, index) => (
                /* al click apro la schermata con la descrizione dell'attrazione*/
                /* nessun item nella griglia e setCity = attrazione*/
                <Grid item xs={6} sm={4} key={index} onClick={() => handleClickAttrazione(attrazione)}>
                  {/* <a style={{ textDecoration: 'none', color: 'inherit' }} 
                    href={`https://www.google.com/maps/search/?api=1&query=${attrazione}+${city}`} target="_blank"> */}
                    <Item>
                      <img 
                          src={`../${city}/${attrazione}.jpg`}
                          alt={attrazione}
                          style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
                          onError={async (e) => {
                            e.target.onerror = null;
                            e.target.src = await getImageUrl(pagina, city, attrazione);
                          }}
                      />
                      <Typography>{attrazione}</Typography>
                    </Item>
                  {/* </a> */}
                </Grid>
              ))
            ):(
              pagina == 'cibo' ? (
                db[city]['cibo'].map((cibo, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <a style={{ textDecoration: 'none', color: 'inherit' }} 
                      href={`https://www.google.com/maps/search/?api=1&query=${cibo}+${city}`} target="_blank">
                      <Item>
                        <img 
                            src={`../${city}/${cibo}.jpg`}
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
                /* Elenco attrazioni */
                Object.keys(db[city]["attrazioni"]).map((attrazione, index) => (
                  /* al click apro la schermata con la descrizione dell'attrazione*/
                  /* nessun item nella griglia e setCity = attrazione*/
                  <Grid item xs={6} sm={4} key={index} onClick={() => handleClickAttrazione(attrazione)}>
                    {/* <a style={{ textDecoration: 'none', color: 'inherit' }} 
                      href={`https://www.google.com/maps/search/?api=1&query=${attrazione}+${city}`} target="_blank"> */}
                      <Item>
                        <img 
                            src={`../${city}/${attrazione}.jpg`}
                            alt={attrazione}
                            style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '16em', borderRadius: '10px' }} 
                            onError={async (e) => {
                              e.target.onerror = null;
                              e.target.src = await getImageUrl(pagina, city, attrazione);
                            }}
                        />
                        <Typography>{attrazione}</Typography>
                      </Item>
                    {/* </a> */}
                  </Grid>
                ))
                
              )
            )
          ):(
            /* Elenco Città se non è stato selezionato nulla --> Home*/
            citta.map((city, index) => (
              <Grid item xs={6} sm={4} key={index} onClick={() => handleClick(city)}>                
                <Item>
                    <img 
                      src={`../${city}/home.jpg`}
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
          )
        )}
      </Grid>
    </Box>
  );
}