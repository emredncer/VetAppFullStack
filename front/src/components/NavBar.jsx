import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">VetApp</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/doctor">Doctor Page</Link></li>
        <li><Link to="/animal">Animal Page</Link></li>
        <li><Link to="/customer">Customer Page</Link></li>
        <li><Link to="/appointment">Appointment Page</Link></li>
        <li><Link to="/vaccine">Vaccine Page</Link></li>
        <li><Link to="/report">Report Page</Link></li>
      </ul>
    </nav>
  );
}