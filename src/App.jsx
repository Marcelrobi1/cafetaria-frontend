import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Importações dos teus componentes
import Navbar from './components/navbar/navbar';
import Hero from './components/Homepage/Hero/Hero';
import Features from './components/Homepage/Features/Features';
import About from './components/Homepage/About/About';
import MenuHighlights from './components/Homepage/MenuHighlights/MenuHighlights';
import BestSellers from './components/Homepage/BestSellers/BestSellers';
import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth';
import Profile from './components/Profile'; 
import Dashboard from './components/Dashboard/Dashboard';

// 1. CRIAMOS A HOMEPAGE FORA DO APP PARA AGRUPAR TUDO SEM ERROS
function HomePage({ currentUser, handleLogout }) {
  return (
    <>
      <Navbar user={currentUser} onLogout={handleLogout} />
      <Hero />
      <Features />
      <About />
      <MenuHighlights />
      <BestSellers />
      <Footer />
    </>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Lê o token do LocalStorage quando a app carrega
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
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* A ROTA PRINCIPAL: Chama o componente HomePage (que tem a Navbar e o Footer) */}
        <Route path="/" element={<HomePage currentUser={currentUser} handleLogout={handleLogout} />} />
        
        {/* A ROTA DE LOGIN: Como vês, não tem Navbar nem Footer! Fica 100% isolada. */}
        <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
        
        {/* A ROTA DO PERFIL: Também 100% isolada. */}
        <Route path="/profile" element={<Profile />} />

        {/* A ROTA DA DASHBOARD*/}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;