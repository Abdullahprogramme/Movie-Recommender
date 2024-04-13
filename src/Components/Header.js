import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';


function Header({ darkMode, setDarkMode }) {

  const theme = useTheme();
  
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={0} width='100%' boxShadow={1}>
      <Grid item xs>
        <Typography className='Header-h5' variant="h5" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#3C3633', marginLeft: 1, marginBottom: 0 }} gutterBottom>
          Passforge 
        </Typography>
        <Typography className='Header-subtitle1' variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#3C3633', marginLeft: 1, marginTop: 0 }} gutterBottom>
          select and copy 
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Tooltip {...{ title: darkMode ? 'Light Mode' : 'Dark Mode' }}>
          <IconButton className='card' color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Grid>
    </Box>
  );
}

export default Header;