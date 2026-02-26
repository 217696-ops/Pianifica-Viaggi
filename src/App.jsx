import "./App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';

import { Analytics } from '@vercel/analytics/react'; // Vercel Analytics

import CitySelector from "./CitySelector";
import ImageGrid from "./ImageGrid";
import CityDescription from "./CityDescription";
import db from '../public/dbCitta.json';

export default function App() {

  const [city, setCity] = useState('');
  const [pagina, setPagina] = useState('attrazioni');
  const [attrazione, setAttrazione] = useState('');

  // Prendo lista regioni
  const tutte_regioni = Object.values(db).map(citta => citta.regione);
  const elenco_regioni = [...new Set(tutte_regioni)];
  elenco_regioni.sort();

  // Tema
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  // Tema
  const [theme, setTheme] = useState(
    createTheme({
      palette: {
        mode: isDark ? "dark" : "light",
      },
    }),
  );
  
  // Grid
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Selettore Regione/Città */}
        <CitySelector 
          city={city} 
          setCity={setCity} 
          attrazione={attrazione} 
          setAttrazione={setAttrazione} 
          pagina={pagina} 
          setPagina={setPagina} 
          theme={theme}
          setTheme={setTheme}
          db={db}
        />

      <Box marginTop={1} >
        <Grid container spacing={1} direction="row-reverse">
          <Grid item sm={3}>            
            <Item>
              {/*se la city è una regione allora descrizione di default (citazioni)*/}
              {elenco_regioni.includes(city) ? (
                <CityDescription city='' attrazione ='' pagina={pagina} setPagina={setPagina} db={db}/>
              ):(
                <CityDescription city={city} attrazione={attrazione} pagina={pagina} setPagina={setPagina} db={db}/> 
              )}              
            </Item>            
          </Grid>
          <Grid item sm={9}>            
            <Item 
              style={{ 
                border: 'none',
                padding: 0,
                background: 'none',
                height: '100%' ,
                boxShadow: 'none'
              }}>            
              <ImageGrid city={city} setCity={setCity} attrazione={attrazione} setAttrazione={setAttrazione} pagina={pagina} db={db} />           
            </Item>            
          </Grid>
        </Grid>
      </Box>
      <Analytics />
    </ThemeProvider>
  );
}
