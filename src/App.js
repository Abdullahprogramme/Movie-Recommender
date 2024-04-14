import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { styled } from '@mui/system';
import Signup from "./Pages/Signup";
import Recommender from "./Pages/Recommender";
import Recommendation from "./Pages/Recommendation";
import Movie from "./Assets/Movie.jpg";

const Background = styled('div')({
  backgroundImage: `url(${Movie})`,
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

function App() {
  return (
    <Router>
      <Background>
        <Routes>
          <Route path="/Recommender" element={<Recommender />} />
          <Route path="/Recommendation" element={<Recommendation />} />
          <Route path="/" element={<Signup />} />
        </Routes>
      </Background>
    </Router>
  );
}

export default App;
