import React from 'react';
import { Link } from 'react-router-dom';
import './Footer2.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Multi-Pet Management App. All rights reserved.</p>
      <div className="footer-nav">
        <Link to="/dash" className="footer-button">Dashboard</Link>
        <Link to="/petSchedule" className="footer-button">Pet Schedule</Link>
        <Link to="/petProfile" className="footer-button">Pet Profile</Link>
        <Link to="/records" className="footer-button">Medical Records</Link>
      </div>
    </footer>
  );
};

export default Footer;
