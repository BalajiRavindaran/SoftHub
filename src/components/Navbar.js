import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu open/close
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu on link click
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? 'blurred' : ''}`}>
        <h2 className="logo">Software Hub</h2>

        {/* Hamburger menu for small screens */}
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar3"></span>
        </div>

        {/* Nav links */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
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
          <li>
            <Link to="/cart" onClick={closeMenu}>Cart</Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          </li>
          <li>
            <Link to="/admindashboard" onClick={closeMenu}>Admin Dashboard</Link>
          </li>
          <li>
            <Link to="/myproducts" onClick={closeMenu}>MyProducts</Link>
          </li>
          <li>
            <Link to="/quicksight" onClick={closeMenu}>QuickSight</Link>
          </li>

        </ul>
      </nav>

      {/* Background overlay */}
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;
