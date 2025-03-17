import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineLogout } from "react-icons/md";
import Brand from "../../../public/vinyl.png";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
    if (!showNavbar) setShowSearch(false);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setShowNavbar(false);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">

        <div className="navbar-left">
          <button className="navbar-toggler" type="button" onClick={handleShowNavbar}>
            <GiHamburgerMenu className="menu-icon" />
          </button>
          <div className="brl-container">
            <img src={Brand} className="brl" alt="brandlogo" />
          </div>

        </div>

        <div className="navbar-center">
          <div className="search-bar-container d-none d-md-flex">
            <div className="search-bar">
              <FaSearch color="white" className="search-icon" />
              <input type="text" className="form-control" placeholder="Search..." />
            </div>
          </div>
        </div>

        <div className="navbar-right">
          <button className="search-icon-btn d-md-none" onClick={handleShowSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="search-bar-container show-search">
          <div className="search-bar">
            <FaSearch color="white" className="search-icon" />
            <input type="text" className="form-control" placeholder="Search..." />
          </div>
        </div>
      )}

      <div className="desktop-menu d-none d-md-flex">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/"><TiHomeOutline /></NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile"><CgProfile /></NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/logout"><MdOutlineLogout /></NavLink>
          </li>
        </ul>
      </div>

      {showNavbar && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            <li>
              <NavLink className="nav-link" to="/" onClick={handleShowNavbar}>Home</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/profile" onClick={handleShowNavbar}>Profile</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/logout" onClick={handleShowNavbar}>Log out</NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
