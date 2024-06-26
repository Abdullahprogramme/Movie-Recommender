import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { styled } from '@mui/system';
import Signup from "./Pages/Signup";
import Recommender from "./Pages/Recommender";
import Recommendation from "./Pages/Recommendation";
import NavBar from "./Components/NavBar";
import Movie from "./Assets/Movie.jpg";
import Movie_Small from "./Assets/Movie_Small.jpg";
import { useMediaQuery, useTheme, CircularProgress } from '@mui/material';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

function NavBarWithLocation() {
  const location = useLocation();

  return location.pathname !== "/" ? <NavBar /> : null;
}

function App() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const Background = styled('div')({
    backgroundImage: isSmallScreen ? `url(${Movie_Small})` : `url(${Movie})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100%',
    // background: 'rgba(255, 255, 255, 0.4)',
    // boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(80px)',
    WebkitBackdropFilter: 'blur(80px)',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Router>
      <Background>
        <NavBarWithLocation />
        <Routes>
        <Route path="/" element={<Signup />} />
          <Route path="/Recommender" element={isAuthenticated ? <Recommender /> : <Navigate to="/" />} />
          <Route path="/Recommendation" element={isAuthenticated ? <Recommendation /> : <Navigate to="/" />} />
        </Routes>
      </Background>
    </Router>
  );
}

export default App;
