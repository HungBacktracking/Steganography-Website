import React from 'react';
import './SteganographyPage.css';
import { Link } from 'react-router-dom';


const SteganographyPage = () => {
    return (
        <div className="container-page">
            <div className='content'></div>
            <div className='steg-options'>
                <Link className='steg-item' to='/steganography/image'>
                        <h2 className='title'>Hidden with images</h2>
                        <p className='description'>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </Link>
                <Link className='steg-item' to='/steganography/video'>
                        <h2 className='title'>Hidden with videos</h2>
                        <p className='description'>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </Link>
                <Link className='steg-item' to='/steganography/audio'>
                        <h2 className='title'>Hidden with audio</h2>
                        <p className='description'>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </Link>
            </div>
        </div>
    )
}

export default SteganographyPage;