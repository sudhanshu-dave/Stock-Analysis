import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.svg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="MaPay Logo" className="navbar-logo" />
          <span>MaPay</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/predict" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Predict
          </NavLink>
          <NavLink 
            to="/watchlist" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Watchlist
          </NavLink>
          <NavLink 
            to="/guide" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Guide
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
