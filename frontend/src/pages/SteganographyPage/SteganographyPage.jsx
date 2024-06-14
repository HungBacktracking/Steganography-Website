import React from 'react';
import { Link } from 'react-router-dom';
import classes from './SteganographyPage.module.css';

const SteganographyPage = () => {
    return (
        <div className={classes.container_page}>
            <div className={classes.content}></div>
            <div className={classes.steg_options}>
                <Link className={classes.steg_item} to='/steganography/image'>
                    <h2 className={classes.title}>Hidden with images</h2>
                    <p className={classes.description}>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </Link>
                <Link className={classes.steg_item} to='/steganography/video'>
                    <h2 className={classes.title}>Hidden with videos</h2>
                    <p className={classes.description}>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </Link>
                <Link className={classes.steg_item} to='/steganography/audio'>
                    <h2 className={classes.title}>Hidden with audio</h2>
                    <p className={classes.description}>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </Link>
            </div>
        </div>
    )
}

export default SteganographyPage;
