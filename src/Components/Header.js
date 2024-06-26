import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs, Typography, Menu, MenuItem, useMediaQuery, useTheme, Box, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Snackbar, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { getAuth, signOut } from 'firebase/auth';

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

// useEffect(() => {
//   // When the component mounts, add an event listener for the popstate event
//   window.addEventListener('popstate', handlePopState);

//   return () => {
//     // When the component unmounts, remove the event listener
//     window.removeEventListener('popstate', handlePopState);
//   };
// }, []);

// const handlePopState = (event) => {
//   // When the popstate event is fired, navigate the user forward
//   window.history.forward();
// };

const handleSignout = async () => {
  setLoading(true);
  const auth = getAuth();

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await signOut(auth);
    // Clear user data here
    localStorage.removeItem('token');
    localStorage.setItem('welcomeShown', 'false');
    // Wait for 1 second to simulate the signout process
    
    navigate('/', { replace: true });
    // if (isMounted.current) {
    //   navigate('/');
    // }
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
    <Typography className="heading" variant={isMediumScreen ? "h5" : "h4"} sx={{marginLeft: 1}}>Movie<br />Recommender</Typography>
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
            <StyledLink className='menuitem' to="/Recommendation">Recommendation</StyledLink>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <StyledLink className='menuitem' to="/Recommender">Home</StyledLink>
          </MenuItem>
          <MenuItem onClick={handleSignout}>
            {loading ? <CircularProgress size={24} className='menuitem' /> : 'Signout'}
          </MenuItem>
        </Menu>
      </>
    ) : (
      <Box display="flex" justifyContent="center" flex="1">
        <Breadcrumbs>
          <StyledLink className='menuitem' to="/Recommendation">Recommendation</StyledLink>
          <StyledLink className='menuitem' to="/Recommender">Home</StyledLink>
          <Typography className='menuitem' color="textPrimary" onClick={handleSignout} sx={{cursor: 'pointer'}}>{loading ? <CircularProgress size={24} /> : 'Signout'}</Typography>
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
