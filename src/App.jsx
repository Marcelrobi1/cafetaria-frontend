// src/App.jsx
import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/navbar/navbar';
import Hero from './components/Homepage/Hero/Hero';
import Features from './components/Homepage/Features/features';
import About from './components/Homepage/About/About';
import MenuHighlights from './components/Homepage/MenuHighlights/MenuHighlights';
import BestSellers from './components/Homepage/BestSellers/BestSellers';
import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth';

function App() {
  const [view, setView] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username) {
      setCurrentUser({ username, role });
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser({
      username: userData.username,
      role: userData.role
    });
    setView('home'); 
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setView('home');
  };

  return (
    <div>
      {view === 'home' ? (
        <>
          <Navbar 
            user={currentUser}
            onLoginClick={() => setView('auth')}
            onLogout={handleLogout}
          />
          <Hero />
          <Features />
          <About />
          <MenuHighlights />
          <BestSellers />
          <Footer />
        </>
      ) : (
        <Auth 
          onLoginSuccess={handleLoginSuccess} 
          onClose={() => setView('home')} 
        />
      )}
    </div>
  );
}

export default App;