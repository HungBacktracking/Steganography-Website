import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './layout/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SteganographyPage from './pages/SteganographyPage/SteganographyPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import StegImagePage from './pages/StegImagePage/StegImagePage';
import StegAudioPage from './pages/StegAudioPage/StegAudioPage';
import StegVideoPage from './pages/StegVideoPage/StegVideoPage';

import './App.css';

const App = () => {
	
	return (
		<Router>
			<Navbar />
			<ToastContainer />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/steganography" element={<SteganographyPage />} />
				<Route path="/steganography/image" element={<StegImagePage />} />
				<Route path="/steganography/audio" element={<StegAudioPage />} />
				<Route path="/steganography/video" element={<StegVideoPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />
			</Routes>
		</Router>
	)
};

export default App;
