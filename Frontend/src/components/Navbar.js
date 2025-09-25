import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="SkillBridge Logo" className="navbar-logo" />
      </div>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Links */}
      <div className={`navbar-right ${isOpen ? "active" : ""}`}>
        <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        <Link to="/opportunities" onClick={() => setIsOpen(false)}>Opportunities</Link>
        <Link to="/applications" onClick={() => setIsOpen(false)}>Applications</Link>
        <Link to="/messaging" onClick={() => setIsOpen(false)}>Messages</Link>
        <Link to="/" onClick={() => setIsOpen(false)}>Sign-Out</Link>
      </div>
    </nav>
  );
};

export default Navbar;
