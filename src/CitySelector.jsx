import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { ThemeProvider, createTheme } from "@mui/material/styles";

import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Grid from '@mui/material/Grid';

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import IconButton from "@mui/material/IconButton";

export default function CitySelector({city, setCity, pagina, setPagina, theme, setTheme, db}) {

  const elenco_citta = Object.keys(db); 
  elenco_citta.sort();

  function handleChange (event) {
    setCity(event.target.value);
  };

  const handleChangeB = (event, pagina) => {
    if (pagina !== null) {
      setPagina(pagina);
    }
  };

  // Tema  
  function toggleTheme() {
    let t;
    if (theme.palette.mode == "dark")
      t = createTheme({ palette: { mode: "light" } });
    else t = createTheme({ palette: { mode: "dark" } });
    setTheme(t);
  }

  const children = [
    <ToggleButton value="attrazioni" key="attrazioni">
      Cosa Vedere
    </ToggleButton>,
    <ToggleButton value="cibo" key="cibo">
      Cosa Mangiare
    </ToggleButton>
  ];
  const control = {
    value: pagina,
    onChange: handleChangeB,
    exclusive: true,
  };

  return (
    <AppBar position="sticky" >
      <Toolbar>
        <Grid container spacing={0} alignItems="center" justifyContent="space-between" marginTop={2} marginBottom={1}>
          <Grid item marginLeft={{xs:-1}}>
            <IconButton onClick={()=>setCity('')}>
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
                      id="select"
                      value={city}
                      label="Oggi voglio visitare"
                      onChange={handleChange}
                      MenuProps={{style: {maxHeight: 500}}}
                    >
                    <MenuItem value=""><i>- Home -</i></MenuItem>
                    {elenco_citta.map((citta,index) => (     
                        <MenuItem key={index+1} value={citta}>{citta}</MenuItem>
                    ))}
                    </Select>
                  </FormControl>      
                </Box>          
              </Grid>
              <Grid item sx={{ width: {xs:'100%', sm:'auto'}, marginTop:{xs:0, sm:-0.5}, marginLeft:{xs:0, sm:1}}}>
                {city !== '' ? (
                  <Stack spacing={2} alignItems="center" marginTop={1}>
                    <ToggleButtonGroup size="medium" {...control} aria-label="Large sizes">
                      {children}
                    </ToggleButtonGroup>
                  </Stack>
                ):(
                <Box onChange={setPagina('attrazioni')}></Box>
                )}
              </Grid>          
            </Grid>          
          </Grid>

          <Grid item xs={1} container justifyContent="flex-end">
            <IconButton onClick={toggleTheme} color="inherit" >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon fontSize="medium"/>
              ) : (
                <Brightness4Icon fontSize="medium"/>
              )}
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>

  );
}

