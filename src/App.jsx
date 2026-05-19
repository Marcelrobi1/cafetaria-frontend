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
import Profile from './components/Profile'; // Nova Importação

function App() {
  const [view, setView] = useState('home'); // Vistas: 'home', 'auth', 'profile'
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
      {/* RENDERIZAÇÃO CONDICIONAL COM BASE NA VIEW */}
      {view === 'home' && (
        <>
          <Navbar 
            user={currentUser}
            onLoginClick={() => setView('auth')}
            onProfileEditClick={() => setView('profile')} // Ativa a view do Perfil
            onLogout={handleLogout}
          />
          <Hero />
          <Features />
          <About />
          <MenuHighlights />
          <BestSellers />
          <Footer />
        </>
      )}

      {view === 'auth' && (
        <Auth 
          onLoginSuccess={handleLoginSuccess} 
          onClose={() => setView('home')} 
        />
      )}

      {view === 'profile' && (
        <Profile 
          onClose={() => setView('home')} 
        />
      )}
    </div>
  );
}

export default App;