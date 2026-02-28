import "./App.css";
import { useState } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Analytics } from '@vercel/analytics/react';

import CitySelector from "./components/CitySelector";
import ImageGrid from "./components/ImageGrid";
import CityDescription from "./components/CityDescription";
import db from '../public/dbCitta.json';
import { getRegioni } from "./utils/helpers";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function App() {
  const [city, setCity] = useState('');
  const [pagina, setPagina] = useState('attrazioni');
  const [attrazione, setAttrazione] = useState('');
  const [food, setFood] = useState('');

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState(
    createTheme({ palette: { mode: isDark ? "dark" : "light" } })
  );

  const elenco_regioni = getRegioni(db);
  const isRegionSelected = elenco_regioni.includes(city);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CitySelector 
        city={city} setCity={setCity} 
        attrazione={attrazione} setAttrazione={setAttrazione} 
        food={food} setFood={setFood} 
        pagina={pagina} setPagina={setPagina} 
        theme={theme} setTheme={setTheme} db={db}
      />
      <Box marginTop={1}>
        <Grid container spacing={1} direction="row-reverse">
          <Grid item sm={3}>            
            <Item>
              <CityDescription 
                city={isRegionSelected ? '' : city} 
                attrazione={isRegionSelected ? '' : attrazione} 
                food={isRegionSelected ? '' : food} 
                pagina={pagina} setPagina={setPagina} db={db}
              />
            </Item>            
          </Grid>
          <Grid item sm={9}>            
            <Item style={{ border: 'none', padding: 0, background: 'none', height: '100%', boxShadow: 'none' }}>            
              <ImageGrid 
                city={city} setCity={setCity} 
                attrazione={attrazione} setAttrazione={setAttrazione} 
                food={food} setFood={setFood}
                pagina={pagina} db={db} 
              />            
            </Item>            
          </Grid>
        </Grid>
      </Box>
      <Analytics />
    </ThemeProvider>
  );
}