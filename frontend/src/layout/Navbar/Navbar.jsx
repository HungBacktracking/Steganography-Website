import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Navbar.module.css';

const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_wrapper}>
                <div className={classes.navbar_item}>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/">
                        Home
                    </NavLink>
                </div>
                <div className={classes.navbar_item}>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/steganography">
                        Let's Steganography
                    </NavLink>
                </div>
                <div className={classes.navbar_item}>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/about">
                        About
                    </NavLink>
                </div>
                <div className={classes.navbar_item}>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/contact">
                        Contact
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
