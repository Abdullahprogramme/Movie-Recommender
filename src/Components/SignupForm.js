// SignupForm.js
import { TextField, InputAdornment, IconButton, Button, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff, PersonAdd } from '@material-ui/icons';
import { Stack } from '@mui/material';

function SignupForm({ formValues, handleInputChange, handleClickShowPassword, showPassword, handleSignup, formErrors, classes, loading }) {
    return (
        <form onSubmit={handleSignup}>
            <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                value={formValues.name}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                onChange={handleInputChange}
            />
            <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                value={formValues.email}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                onChange={handleInputChange}
            />
            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={formValues.password}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                onChange={handleInputChange}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />
            
            <Stack direction='column' spacing={2}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<PersonAdd />}
                type="submit"
              >
                Signup
              </Button>
            )}
            </Stack>
        </form>
    );
}

export default SignupForm;
