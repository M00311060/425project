import React from 'react';
import './Header.css';
import logo from '../assets/logo1.jpg';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Multi-Pet Management Logo" className="logo" />
        <h1>Multi-Pet Management Plus</h1>
      </div>
    </header>
  );
};

export default Header;
