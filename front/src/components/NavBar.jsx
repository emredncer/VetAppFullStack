import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">VetApp</Link>
      </div>

      {/* Canlı sayfa takibi yapan navbar */}
      <ul className="navbar-links">
        <li className={location.pathname === '/doctor' ? 'activePage' : ''}><Link to="/doctor">Doctor Page</Link></li>
        <li className={location.pathname === '/animal' ? 'activePage' : ''}><Link to="/animal">Animal Page</Link></li>
        <li className={location.pathname === '/customer' ? 'activePage' : ''}><Link to="/customer">Customer Page</Link></li>
        <li className={location.pathname === '/appointment' ? 'activePage' : ''}><Link to="/appointment">Appointment Page</Link></li>
        <li className={location.pathname === '/vaccine' ? 'activePage' : ''}><Link to="/vaccine">Vaccine Page</Link></li>
        <li className={location.pathname === '/report' ? 'activePage' : ''}><Link to="/report">Report Page</Link></li>
      </ul>
    </nav>
  );
}
