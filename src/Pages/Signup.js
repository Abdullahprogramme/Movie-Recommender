import React, { useState } from 'react';
import { Tab, Tabs, Card, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Assets/Background.jpg';

// Form validation imports
import * as yup from 'yup';
import validator from 'validator';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

// React Router imports
import { useNavigate } from 'react-router-dom';

// Form components
import SignupForm from '../Components/SignupForm';
import LoginForm from '../Components/LoginForm';

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Styles
const useStyles = makeStyles(theme => ({
    card: {
        background: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(7.2px)',
        WebkitBackdropFilter: 'blur(7.2px)',
        border: '1px solid rgba(255, 255, 255, 0.45)',
        padding: '2em',
        width: '300px',
        height: '450px',
        [theme.breakpoints.up('sm')]: {
          width: '400px',
          height: '450px',
        },
    },
    button: {
        marginTop: '20px',
    },
    div: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }
}));

// Signup form validation schema
const schema = yup.object().shape({
      name: yup.string().matches(/^[a-zA-Z\s]+$/, 'Name must only contain alphabetic characters.').required('Name is required.'),
      email: yup.string().test('email', 'Email is invalid.', value => validator.isEmail(value)).required('Email is required.'),
      password: yup.string().min(6, 'Password must be at least 6 characters long.').required('Password is required.'),
  });

// Login form validation schema
const loginSchema = yup.object().shape({
      email: yup.string().test('email', 'Email is invalid.', value => validator.isEmail(value)).required('Email is required.'),
      password: yup.string().min(6, 'Password must be at least 6 characters long.').required('Password is required.'),
});

export default function Signup() {
    const [value, setValue] = useState(0);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
  });

  const [formErrors, setFormErrors] = useState({
      name: '',
      email: '',
      password: '',
  });

  // 
  const handleChange = (event, newValue) => {
      setValue(newValue);
      resetForm();
  };

  // Show/hide password
  const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
  };

  // Reset the form values and errors
  const resetForm = () => {
      // Reset the form values
      setFormValues({
          name: '',
          email: '',
          password: '',
      });
    
      // Reset the form errors
      setFormErrors({
          name: '',
          email: '',
          password: '',
      });
  };

  // Handle input change
  const handleInputChange = (event) => {
      setFormValues({
          ...formValues,
          [event.target.name]: event.target.value,
      });
  };

  // Navigate to another page
  const navigate = useNavigate();
  
  // Signup function
  const handleSignup = async (event) => {
      event.preventDefault();
      setLoading(true); // Start loading

      try {
          await schema.validate(formValues, { abortEarly: false });
      
          // Save credentials to Firebase
          try {
              const userCredential = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
              const user = userCredential.user;
              await updateProfile(user, { displayName: formValues.name });
              // user is now signed up, you can use the 'user' object for further operations

              // Show confirmation message
              setSnackbarMessage('User signed up successfully.');
              setOpenSnackbar(true);

              // Switch to login tab
              setValue(1);
              setFormValues({
                  name: '',
                  email: '',
                  password: '',
              });
          
          } catch (error) {
              // Show error message
              setSnackbarMessage('A user with this email already exists.');
              setOpenSnackbar(true);
          }

        
      } catch (error) {
          if (error instanceof yup.ValidationError) {
              // Create an error object that matches the structure of formErrors
              const newErrors = error.inner.reduce((errors, err) => {
                return { ...errors, [err.path]: err.message };
              }, {});
        
              // Show alert message
              setSnackbarMessage('Please make sure all fields are filled correctly.');
              setOpenSnackbar(true);
            
              // Update form errors state
              setFormErrors(newErrors);
            }
        }

        setLoading(false); // Stop loading
  };

  // Login function
  const handleLogin = async (event) => {
      event.preventDefault();
      setLoading(true); // Start loading

      try {
          await loginSchema.validate({ email, password }, { abortEarly: false });

          // Perform login operation here
          try {
              await signInWithEmailAndPassword(auth, email, password);
              // user is now logged in, you can use the 'user' object for further operations

              // Show confirmation message
              setSnackbarMessage('User logged in successfully.');
              setOpenSnackbar(true);

              // Navigate to Recommender.js
              navigate('/Recommender');
          } catch (error) {
              setSnackbarMessage('Invalid email or password.');
              setOpenSnackbar(true);
          }
        
        
      } catch (error) {
          if (error instanceof yup.ValidationError) {
            // Show alert message
            setSnackbarMessage('Please correct the errors in the form.');
            setOpenSnackbar(true);

            // Update form errors state
            const newErrors = error.inner.reduce((errors, err) => {
              return { ...errors, [err.path]: err.message };
            }, {});

            setFormErrors(newErrors);
          }
      }

      setLoading(false); // Stop loading
  };

  // Snackbar functions
  const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }

      setOpenSnackbar(false);
  };

  // In your component
  const classes = useStyles();

  // Render the component
  return (
    <div className={classes.div}>
      <Card className={classes.card}>
        <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Signup" />
            <Tab label="Login" />
        </Tabs>
        {value === 0 && (
            <SignupForm 
                formValues={formValues} 
                handleInputChange={handleInputChange} 
                handleClickShowPassword={handleClickShowPassword} 
                showPassword={showPassword} 
                handleSignup={handleSignup} 
                formErrors={formErrors} 
                classes={classes} 
            />
        )}
        {value === 1 && (
            <LoginForm 
                email={email} 
                setEmail={setEmail} 
                password={password} 
                setPassword={setPassword} 
                showPassword={showPassword} 
                setShowPassword={setShowPassword} 
                handleLogin={handleLogin} 
                formErrors={formErrors} 
                loading={loading} 
                classes={classes} 
            />
        )}
      </Card>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
              {snackbarMessage}
          </MuiAlert>
      </Snackbar>
    </div>
  );
}
