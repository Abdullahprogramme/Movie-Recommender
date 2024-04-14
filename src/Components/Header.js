import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs, Typography, Menu, MenuItem, useMediaQuery, useTheme, Box, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Snackbar, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit'
});

function Header() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

const handleSnackbarClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setSnackbarOpen(false);
};

const isMounted = useRef(false);

useEffect(() => {
  isMounted.current = true;
  return () => {
    isMounted.current = false;
  };
}, []);

const handleSignout = async () => {
  setLoading(true);
  try {
    // Clear user data here
    localStorage.removeItem('token');
    // Wait for 1 second to simulate the signout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isMounted.current) {
      navigate('/');
    }
  } catch (error) {
    console.error('Failed to sign out:', error);
    setSnackbarMessage('Failed to sign out');
    setSnackbarOpen(true);
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
};

return (
  <Box display="flex" justifyContent="space-between" alignItems="center" p={0} boxShadow={1} width="100%">
    <Typography variant={isMediumScreen ? "h6" : "h4"} sx={{marginLeft: 1}}>Movie<br />Recommender</Typography>
    {isSmallScreen ? (
      <>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <StyledLink to="/Recommendation">Recommendation</StyledLink>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <StyledLink to="/Recommender">Home</StyledLink>
          </MenuItem>
          <MenuItem onClick={handleSignout}>
            {loading ? <CircularProgress size={24} /> : 'Signout'}
          </MenuItem>
        </Menu>
      </>
    ) : (
      <Box display="flex" justifyContent="center" flex="1">
        <Breadcrumbs>
          <StyledLink to="/Recommendation">Recommendation</StyledLink>
          <StyledLink to="/Recommender">Home</StyledLink>
          <Typography color="textPrimary" onClick={handleSignout} sx={{cursor: 'pointer'}}>{loading ? <CircularProgress size={24} /> : 'Signout'}</Typography>
        </Breadcrumbs>
      </Box>
    )}
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </Box>
);
}

export default Header;
