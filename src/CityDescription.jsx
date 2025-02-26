import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Meteo from "./Meteo";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import RestaurantIcon from '@mui/icons-material/Restaurant';

const AccessKey = "b5CJx4NyEPDM9qyrKuxo2fheWCsR5mTEcN5Onb3CH8o";
const SecretKey = "kJXk2RlmkkLJkyBr161RBCIqQjS5C6ZvbfDJ4jJG7yw";

const Citazioni = [
  {
    citazione:"Non è il freddo, è l'umidità che ti ammazza: LE VELINEEE!!!",
    autore:"Ezio Greggio"
  },
  {
    citazione:"Non ci sono più le mezze stagioni",
    autore:"Antonio Vivaldi"
  },
  {
    citazione:"... .- .-.. .. - .. / -.. .- / -... ..- --. .-.. .. .- -. ---",
    autore:"Samuel Morse"
  },
  {
    citazione:"Il diavolo fa le pentole, ma non i coperchi",
    autore:"Giorgio Mastrota"
  },
  {
    citazione:"Meglio l'erba del vicino che i vicini di Erba",
    autore:"Bruno Vespa"
  },
  {
    citazione:"La non violenza è la più forte arma mai inventata dall'uomo, però...",
    autore:"Mahatma Ghandi"
  },
  {
    citazione:"Vendo Alfa Romeo 147 ottime condizioni. No perditempo",
    autore:"Martin Luther King"
  },
  {
    citazione:"Il mio falegname con 30.000 lire questo sito lo faceva meglio",
    autore:"Nelson Mandela"
  },
  {
    citazione:"Il nuoto è lo sport più completo",
    autore:"Barak Obama"
  },
  {
    citazione:`Se ni' mondo esistesse un po' di bene
    e ognun si honsiderasse suo fratello
    ci sarebbe meno pensieri e meno pene
    ne il mondo ne sarebbe assai più bello`,
        autore:"Pietro Pacciani"
  }
];

async function getImageUrl(city, attraction) {
  try {
    const immagine = attraction; //+ '+' + city;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${immagine}&client_id=${AccessKey}`,
    );
    const output = await response.json();
    // console.log(output);
    // da 0 a 9
    const URL_immagine = output.results[0].urls.regular;
    // console.log(URL_immagine);
    return URL_immagine;
  } catch (e) {
    return `../public/cityImage.jpg`;
  }
}

function creaLinkGoogleMaps(attrazioni, citta) {
  // Sostituisce gli spazi con '+'
  const cittaFormattata = citta.replace(/\s/g, '+');
  let link = 'https://www.google.com/maps/dir/';

  attrazioni.forEach((attrazione, index) => {
    if (!attrazione.toLowerCase().includes('isola')) {
      const attrazioneFormattata = attrazione.replace(/\s/g, '+');
      link += `${attrazioneFormattata},${cittaFormattata}/`;
    }
  });

  return link;
}

export default function CityDescription({ city, pagina, setPagina, db }) {
  const [date, setDate] = React.useState("Oggi");

  const handleChangeB = (event, pagina) => {
    setPagina(pagina);
  };

  const children = [
    <ToggleButton value="attrazioni" key="attrazioni">
      Cosa Vedere
    </ToggleButton>,
    <ToggleButton value="cibo" key="cibo">
      Cosa Mangiare
    </ToggleButton>,
  ];

  const control = {
    value: pagina,
    onChange: handleChangeB,
    exclusive: true,
  };

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <Box>
      {/* Immagine Della Città */}
      {city !== "" ? (
        <Box>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'left' }}> {city} </h1>
            <a
              href={`https://guide.michelin.com/it/it/ristoranti?q=${city}&sort=lowestPrice`}
              target="_blank"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <RestaurantIcon fontSize="medium"/>
            </a>
          </Box>
          {/* <a
            href={`https://www.google.com/maps/search/?api=1&query=${city}`}
            target="_blank"
          > */}
          <a href={creaLinkGoogleMaps(db[city]["attrazioni"], city)} target="_blank">
            <img
              src={`../public/${city}/home.jpg`}
              alt={city}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
                height: "20em",
                borderRadius: "10px",
                marginTop: "0.5em",
              }}
              onError={async (e) => {
                e.target.onerror = null;
                e.target.src = await getImageUrl(city, city);
              }}
            />
          </a>
        </Box>
      ) : (
        <img
          src={"../public/default.jpg"}
          alt={city}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            minHeight: "18em",
            borderRadius: "10px",
            marginTop: "0.5em",
          }}
        />
      )}

      {/* Descrizione Della Città */}
      {city !== "" ? (
        <Box>
          <Typography style={{ textAlign: "left" }}>
            {db[city]["descrizione"]}
          </Typography>
          <Box marginBottom={1} marginTop={2} sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="select-meteo-label">Meteo</InputLabel>
              <Select
                labelId="select-meteo-label"
                id="select-meteo"
                value={date}
                label="Meteo"
                onChange={handleChange}
              >
                <MenuItem value={"Oggi"}>Oggi</MenuItem>
                <MenuItem value={"Domani"}>Domani</MenuItem>
                <MenuItem value={"Dopodomani"}>Dopodomani</MenuItem>
                <MenuItem value={"IlGiornoDopo"}>Il Giorno Dopo</MenuItem>
                <MenuItem value={"IlGiornoDopoAncora"}>
                  Il Giorno Dopo Ancora
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Meteo city={city} date={date} db={db} />
        </Box>
      ) : (
        <Box style={{ width: "100%" }}>
          {(() => {
            let indice = Math.floor(Math.random() * Citazioni.length);
            return (
              <Typography style={{ textAlign: "left", width: "100%" }}>
                "{Citazioni[indice].citazione}"<br></br> <i>{Citazioni[indice].autore}</i>
              </Typography>
            );
          })()}
        </Box>
      )}
    </Box>
  );
}
