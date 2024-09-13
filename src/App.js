// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';  // Ensure this file exists
import '@aws-amplify/ui-react/styles.css';  // Ensure you have this imported

import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Products from './pages/Products';
// import About from './pages/About';
// import Contact from './pages/Contact';
import Login from './pages/Login';

Amplify.configure(awsconfig);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
