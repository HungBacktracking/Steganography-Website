import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './layout/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SteganographyPage from './pages/SteganographyPage/SteganographyPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import StegImagePage from './pages/StegImagePage/StegImagePage';

import './App.css';

const App = () => {
	const location = useLocation();
	
	const getBackgroundClass = () => {
		switch (location.pathname) {
			case '/':
				return 'home-page';
			case '/steganography':
				return 'background-container-steg steganography-page';
			case '/steganography/image':
				return 'steg-image-page';
			case '/about':
				return 'about-page';
			case '/contact':
				return 'contact-page';
			default:
				return '';
		}
	};

	return (
		<div className={`background-container ${getBackgroundClass()}`}>
			<div className='overlay'>
				<Navbar />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/steganography" element={<SteganographyPage />} />
					<Route path="/steganography/image" element={<StegImagePage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/contact" element={<ContactPage />} />
				</Routes>
			</div>
		</div>
	)
};

export default App;
