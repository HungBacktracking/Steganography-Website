import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar-wrapper">
                <div className="navbar-item">
                    <NavLink className={({ isActive }) => isActive ? `nav_link active` : `nav_link`} to="/">
                        Home
                    </NavLink>
                </div>
                <div className="navbar-item">
                    <NavLink className={({ isActive }) => isActive ? `nav_link active` : `nav_link`} to="/steganography">
                        Let's Steganography
                    </NavLink>
                </div>
                <div className="navbar-item">
                    <NavLink className={({ isActive }) => isActive ? `nav_link active` : `nav_link`} to="/about">
                        About
                    </NavLink>
                </div>
                <div className="navbar-item">
                    <NavLink className={({ isActive }) => isActive ? `nav_link active` : `nav_link`} to="/contact">
                        Contact
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar;