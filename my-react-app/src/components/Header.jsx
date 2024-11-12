import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo1.jpg'; // Import the logo

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Multi-Pet Management Logo" className="logo" />
        <h1>Multi-Pet Management Plus</h1>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
