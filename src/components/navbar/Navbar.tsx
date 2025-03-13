import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import Brand from '../../../public/genius-removebg-preview.png'
import './navbar.css'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="menu-icon" onClick={handleShowNavbar}>
          <GiHamburgerMenu />
        </div>

        <div className="logo">
          <img src={Brand} className='brl' alt="brandlogo" />
        </div>

        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
