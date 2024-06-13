import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Navbar.module.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar-wrapper">
                <div className="navbar-item">
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/">
                        Home
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/steganography">
                        Let's Steganography
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/about">
                        About
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/contact">
                        Contact
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar;