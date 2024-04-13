import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Recommender from "./Pages/Recommender";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Recommender" element={<Recommender />} />
        <Route path="/" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;