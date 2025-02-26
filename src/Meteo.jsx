import { useState, useEffect } from "react";

import Typography from '@mui/material/Typography';

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const token = "8cd95670411e3573574d297cfecc7537";
const italyTimezone = 3600;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3b444f" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function findImage(t, orario, alba, tramonto) {
  if (t == "Clear" && orario >= alba && orario <= tramonto) return <WbSunnyIcon />;
  if (t == "Clear" && (orario < alba || orario > tramonto)) return <NightsStayIcon />;
  if (t == "Clouds") return <CloudIcon />;
  if (t == "Rain") return <ThunderstormIcon />;
  if (t == "Snow") return <AcUnitIcon />;
}

function convertUnixToTime(unixTimestamp, giorno_data, orario) {
  // Converte il timestamp Unix in millisecondi
  let date = new Date(unixTimestamp * 1000);

  let anno = date.getFullYear();
  let mese = date.getMonth() + 1;
  let giorno = date.getDate();
  let ore = date.getHours();
  let minuti = "0" + date.getMinutes();

  if (giorno < 10) giorno = "0" + giorno;
  if (mese < 10) mese = "0" + mese;
  if (ore < 10) ore = "0" + ore;
  let formattedTime = giorno + "/" + mese + "/" + anno + " " + ore + ":" + minuti.substr(-2);

  if (giorno_data && !orario) {
    let tempo = formattedTime.split(" ");
    return tempo[0];
  }
  if (!giorno_data && orario) {
    let tempo = formattedTime.split(" ");
    return tempo[1];
  } else return formattedTime;
}

function giornoToData(data) {
  let giorno_data;
  if (data == "Oggi") {
    giorno_data = new Date().getTime()/1000;
    giorno_data = convertUnixToTime(giorno_data, 1, 0);
  }
  if (data == "Domani") {
      giorno_data = new Date().getTime()/1000;
      giorno_data += 60*60*24;
      giorno_data = convertUnixToTime(giorno_data, 1, 0);
    }
  if (data == "Dopodomani") {
      giorno_data = new Date().getTime()/1000;
      giorno_data += 2*60*60*24;
      giorno_data = convertUnixToTime(giorno_data, 1, 0);
    }
  if (data == "IlGiornoDopo") {
      giorno_data = new Date().getTime()/1000;
      giorno_data += 3*60*60*24;
      giorno_data = convertUnixToTime(giorno_data, 1, 0);
    }
  if (data == "IlGiornoDopoAncora") {
      giorno_data = new Date().getTime()/1000;
      giorno_data += 4*60*60*24;
      giorno_data = convertUnixToTime(giorno_data, 1, 0);
    }
  return giorno_data;
}

function valutaGiorno(data, output, timezone) {
  // output rispetto a Greenwich
  let giorno_data = giornoToData(data);
  if(giorno_data == convertUnixToTime(output-3600+timezone, 1, 0)) return true;
  else return false;
}

async function getWeather(city, data, db) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},${db[city]["nazione"]}&APPID=${token}`
    );
    const output = await response.json();
    // console.log(output);
    let alba = convertUnixToTime(output.city.sunrise+output.city.timezone-italyTimezone, 0, 1);
    let tramonto = convertUnixToTime(output.city.sunset+output.city.timezone-italyTimezone, 0, 1);

    // Sunset e Sunrise
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container direction="column" spacing={1} style={{ height: '100%' }}>
              <Grid item xs={6} style={{ flex: 1 }}>
                <Item 
                  sx={{ 
                    minHeight: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                  <img src={"./public/sunrise.svg"} alt={"Tramonto"} style={{ height: '2em' }}/>
                  <Typography variant="body1" marginLeft={1}>{alba}</Typography>
                </Item>
              </Grid>
              <Grid item xs style={{ flex: 1 }}>
                <Item 
                  sx={{ 
                    minHeight: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                  <img src={"./public/sunset.svg"} alt={"Tramonto"} style={{ height: '2em' }}/>
                  <Typography variant="body1" marginLeft={1}>{tramonto}</Typography>
                </Item>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            
            {/* Tabelle riempite con inforamzione sul meteo del giorno */}
            {(() => {
              let body = [];
              let i=0;
              while (!valutaGiorno(data, output.list[i].dt, output.city.timezone)) i++;
              while (valutaGiorno(data, output.list[i].dt, output.city.timezone)) {
                let orario = convertUnixToTime(output.list[i].dt+output.city.timezone-italyTimezone, 0, 1);
                
                body.push(
                  <TableRow key={i} >
                    <TableCell align="left" sx={{ padding: '0 0em' }}>{orario}</TableCell>
                    <TableCell align="center" sx={{ padding: '0 4em' }}>{findImage(output.list[i].weather[0].main, orario, alba, tramonto)}</TableCell>
                    <TableCell align="right" sx={{ padding: '0 0em' }}>{Math.floor(output.list[i].main.temp - 273.15)}°C</TableCell>
                  </TableRow>
                );
                i++;
              }
              return (
                <Grid item xs={12}>
                    <Item>
                      <TableContainer align="center">
                        <TableRow>
                          <TableCell align="left" sx={{ padding: '0 0em' }}></TableCell>
                          <TableCell align="center" sx={{ padding: '0 1em' }}>{giornoToData(data)} {city} ({output.city.timezone < 0 ? "" : "+"}{output.city.timezone/3600} GTM)</TableCell>
                          <TableCell align="right" sx={{ padding: '0 0em' }}></TableCell>
                        </TableRow>
                        {body}
                      </TableContainer>
                    </Item>
                </Grid>
              );
        
            })()}
          </Grid>
        </Grid>
      </Box>
    );
  } catch (e) {
    // console.log(e);
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12}>
          <Item>
            <Box>
              Non ho trovato previsioni per questo giorno
            </Box>
          </Item>
        </Grid>
      </Box>
    );
  }
}

export default function Meteo({ city, date, db}) {
  const [rows, setRows] = useState(null);

  async function getData() {
    let r = await getWeather(city, date, db);
    setRows(r);
  }

  useEffect(() => {
    getData();
  }, [city, date]);

  return (
    <Box >
      {rows == null ? <h1>Caricamento in corso...</h1> : rows}
    </Box>
  );
}
