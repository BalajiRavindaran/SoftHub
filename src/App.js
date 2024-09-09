import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div>
        {/* Static Navbar across all pages */}
        <Navbar />

        {/* Define routes for the pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes for other pages as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
