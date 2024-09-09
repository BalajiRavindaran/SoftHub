// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);  // State to toggle navbar on small screens

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the menu on link click
  const closeMenu = () => {
    setIsOpen(false);  // Close the navbar
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Software Hub</h2>

      {/* Hamburger menu for small screens */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Nav links */}
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/products" onClick={closeMenu}>Products</Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMenu}>About</Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
        </li>
        <li>
          <Link to="/login" onClick={closeMenu}>Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
