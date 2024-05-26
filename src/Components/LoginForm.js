// LoginForm.js
import { TextField, InputAdornment, IconButton, Button, CircularProgress, Link, Snackbar, Box } from '@material-ui/core';
import { Visibility, VisibilityOff, LockOpen } from '@material-ui/icons';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Alert } from '@material-ui/lab';
import { Stack } from '@mui/material';

function LoginForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, handleLogin, formErrors, loading, classes }) {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleForgotPassword = (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const auth = getAuth();
  
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent successfully
        setSnackbarMessage('Reset email sent');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        // An error occurred
        setSnackbarMessage('Enter your email');
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };
  
    return (
        <>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleCloseSnackbar} severity="info">
              {snackbarMessage}
            </Alert>
        </Snackbar>
        
        <form onSubmit={handleLogin}>
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                onChange={event => setEmail(event.target.value)}
            />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                onChange={event => setPassword(event.target.value)}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />

            <Stack direction='column' spacing={2}>
              <Link
                  component="button"
                  variant="body2"
                  onClick={handleForgotPassword}
              >
                  Forgot Password?
              </Link>

              {loading ? (
                <Box display='flex' justifyContent='center'>
                <CircularProgress />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<LockOpen />}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
            </Stack>
        </form>
        </>
    );
}

export default LoginForm;
