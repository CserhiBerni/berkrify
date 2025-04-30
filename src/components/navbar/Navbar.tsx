import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineLogout } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiLogIn } from "react-icons/fi";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { MdPlaylistAdd } from "react-icons/md";
import Brand from "../../assets/logo.svg";
import { usePlaylists } from "../services/service/PlaylistContext";
import { usePlayer } from "../services/service/PlayerContext";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface NavbarProps {
  onSearch: (query: string) => void;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, showSearch: propShowSearch }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPlaylistMessage, setShowPlaylistMessage] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { fetchLikedSongs } = usePlaylists();
  const { setCurrentSong } = usePlayer();
  let animationFrameId: number = 0;

  const iconSize = 20;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsAdmin(userData.role === "admin");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const rotate = () => {
      setRotation((prev) => prev + 2);
      animationFrameId = requestAnimationFrame(rotate);
    };
    if (isHovering) rotate();
    else cancelAnimationFrame(animationFrameId);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering]);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
    if (!showNavbar) setShowSearch(false);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setShowNavbar(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    onSearch(query);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("likedSongs");

    setIsLoggedIn(false);
    setIsAdmin(false);

    window.location.href = "/login";
  };

  const handlePlaylistClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowPlaylistMessage(true);
      setTimeout(() => {
        setShowPlaylistMessage(false);
      }, 3000);
    }
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <nav className={`navbar navbar-expand-md navbar-light fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="navbar-left">
          <button className="navbar-toggler" type="button" onClick={handleShowNavbar}>
            <GiHamburgerMenu className="menu-icon" />
          </button>
          <div className="brl-container">
            <NavLink to="/">
              <img
                src={Brand}
                className="brl"
                alt="brandlogo"
                style={{ transform: `rotate(${rotation}deg)` }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              />
            </NavLink>
          </div>
        </div>

        {propShowSearch !== false && (
          <div className="search-bar-container d-none d-md-flex">
            <div className="search-bar">
              <FaSearch color="white" className="search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        )}

        <div className="navbar-right">
          {propShowSearch !== false && (
            <button className="search-icon-btn d-md-none" onClick={handleShowSearch}>
              <FaSearch />
            </button>
          )}
        </div>
      </div>

      {propShowSearch !== false && showSearch && (
        <div className="search-bar-container show-search">
          <div className="search-bar">
            <FaSearch color="white" className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}

      <div className="desktop-menu d-none d-md-flex">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <NavLink className={getNavLinkClass} to="/" end>
              <TiHomeOutline size={iconSize} />
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className={getNavLinkClass}
              to={isLoggedIn ? "/playlists" : "/login"}
              onClick={handlePlaylistClick}
              end
            >
              <MdOutlineLibraryMusic size={iconSize} />
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className={({ isActive }) => {
                const exactMatch = window.location.pathname === "/playlists/create";
                return exactMatch ? "nav-link active" : "nav-link";
              }}
              to={isLoggedIn ? "/playlists/create" : "/login"}
              onClick={handlePlaylistClick}
            >
              <MdPlaylistAdd size={iconSize} />
            </NavLink>
          </li>

          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/profile">
                  <CgProfile size={iconSize} />
                </NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleLogout}>
                  <MdOutlineLogout size={iconSize} />
                </a>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/upload">
                    <IoCloudUploadOutline size={iconSize} />
                  </NavLink>
                </li>
              )}
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/login">
                  <FiLogIn size={iconSize} />
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/register">
                  <FaUserPlus size={iconSize} />
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {showNavbar && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            <li>
              <NavLink
                className={getNavLinkClass}
                to="/"
                onClick={handleShowNavbar}
                end
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                className={getNavLinkClass}
                to={isLoggedIn ? "/playlists" : "/login"}
                onClick={(e) => { handleShowNavbar(); !isLoggedIn && handlePlaylistClick(e); }}
                end
              >
                My Playlists
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => {
                  const exactMatch = window.location.pathname === "/playlists/create";
                  return exactMatch ? "nav-link active" : "nav-link";
                }}
                to={isLoggedIn ? "/playlists/create" : "/login"}
                onClick={(e) => { handleShowNavbar(); !isLoggedIn && handlePlaylistClick(e); }}
              >
                Create Playlist
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <NavLink
                    className={getNavLinkClass}
                    to="/profile"
                    onClick={handleShowNavbar}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="nav-link"
                    to="/"
                    onClick={() => { handleShowNavbar(); handleLogout(); }}
                  >
                    Log out
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink
                      className={getNavLinkClass}
                      to="/upload"
                      onClick={handleShowNavbar}
                    >
                      Upload Form
                    </NavLink>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    className={getNavLinkClass}
                    to="/login"
                    onClick={handleShowNavbar}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={getNavLinkClass}
                    to="/register"
                    onClick={handleShowNavbar}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {showPlaylistMessage && !isLoggedIn && (
        <div className="playlist-login-message">
          To be able to create your playlist you must log in
        </div>
      )}

      <style>
        {`
          .playlist-login-message {
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
            animation: fadeInOut 3s forwards;
          }
          
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          .navbar {
            transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
            background-color: rgba(56, 48, 98, 1);
          }
          
          .navbar-scrolled {
            background-color: rgba(56, 48, 98, 0.7);
            backdrop-filter: blur(8px);
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;