// LoginForm.js
import { TextField, InputAdornment, IconButton, Button, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff, LockOpen } from '@material-ui/icons';

function LoginForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, handleLogin, formErrors, loading, classes }) {
    return (
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
            {loading ? (
              <CircularProgress />
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
        </form>
    );
}

export default LoginForm;