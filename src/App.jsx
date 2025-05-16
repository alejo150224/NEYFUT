// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Players from "./components/Players";
import CompAPi from "./components/CompAPi";
import Partidos from "./components/Partidos";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultados" element={<Partidos />} />
        <Route path="/tabla" element={<Players />} />
        <Route path="/ia" element={<CompAPi />} />
      </Routes>
    </Router>
  );
}

export default App;
