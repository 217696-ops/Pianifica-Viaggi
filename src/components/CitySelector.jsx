import * as React from 'react';
import { createTheme } from "@mui/material/styles";
import { Box, InputLabel, MenuItem, FormControl, Select, Stack, ToggleButton, ToggleButtonGroup, Grid, AppBar, Toolbar, IconButton } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { getRegioni } from '../utils/helpers';

export default function CitySelector({city, setCity, attrazione, setAttrazione, food, setFood, pagina, setPagina, theme, setTheme, db}) {
  const elenco_regioni = getRegioni(db);

  const handleCityChange = (event) => {
    setCity(event.target.value);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handlePageChange = (event, nuovaPagina) => {
    if (nuovaPagina !== null) {
      setPagina(nuovaPagina);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setTheme(createTheme({ palette: { mode: theme.palette.mode === "dark" ? "light" : "dark" } }));
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Grid container spacing={0} alignItems="center" justifyContent="space-between" marginTop={2} marginBottom={1}>
          <Grid item marginLeft={{xs:-1}}>
            <IconButton onClick={() => { setCity(''); setAttrazione(''); setFood('');}}>
              <HomeRoundedIcon fontSize="large"/>
            </IconButton>          
          </Grid>

          <Grid item xs={8} sm={10}>
            <Grid container justifyContent="left">
              <Grid item sx={{ width: {xs:'100%', sm:'auto'}}}>
                <Box sx={{minWidth: 190 }}>
                  <FormControl fullWidth>
                    <InputLabel id="select-label">Oggi voglio visitare</InputLabel>
                    <Select
                      labelId="select-label"
                      value={city}
                      label="Oggi voglio visitare"
                      onChange={handleCityChange}
                      MenuProps={{style: {maxHeight: 500}}}
                    >
                      <MenuItem value="" onClick={() => {setAttrazione(''); setFood('');}}><i>- Home -</i></MenuItem>
                      {city !== '' && !elenco_regioni.includes(city) && (                      
                        <MenuItem value={city} onClick={() => {setAttrazione(''); setFood('');}}>{city}</MenuItem>
                      )}
                      {elenco_regioni.map((regione, index) => (
                        <MenuItem key={index} value={regione} onClick={() => {setAttrazione(''); setFood('');}}>{regione}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>      
                </Box>          
              </Grid>
              <Grid item sx={{ width: {xs:'100%', sm:'auto'}, marginTop:{xs:0, sm:-0.5}, marginLeft:{xs:0, sm:1}}}>
                {city !== '' && !elenco_regioni.includes(city) ? (
                  <Stack spacing={2} alignItems="center" marginTop={1}>
                    <ToggleButtonGroup size="medium" value={pagina} exclusive onChange={handlePageChange}>
                      <ToggleButton value="attrazioni" onClick={() => {setAttrazione(''); setFood('');}}>Cosa Vedere</ToggleButton>
                      <ToggleButton value="cibo" onClick={() => {setAttrazione(''); setFood('');}}>Cosa Mangiare</ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                ):(
                  <Box onChange={setPagina('attrazioni')}></Box>
                )}
              </Grid>          
            </Grid>          
          </Grid>

          <Grid item xs={1} container justifyContent="flex-end">
            <IconButton onClick={toggleTheme} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon fontSize="medium"/> : <Brightness4Icon fontSize="medium"/>}
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}