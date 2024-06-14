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
				return 'steganography-page';
			case '/steganography/image':
				return 'background-container-steg steg-image-page';
			case '/about':
				return 'about-page';
			case '/contact':
				return 'contact-page';
			default:
				return '';
		}
	};

	return (
		<div className={`background-container flex flex-col max-h-[100vh] ${getBackgroundClass()}`}>
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/steganography" element={<SteganographyPage />} />
				<Route path="/steganography/image" element={<StegImagePage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />
			</Routes>
		</div>
	)
};

export default App;
