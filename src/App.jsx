import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {CartProvider} from './context/CartContext';
import './index.css';

import Navbar from './components/navbar/navbar'; // Barra de navegação (Navba)
import Home from './pages/Home/Home'; //Inicio
import MenuPage from './pages/MenuPage/MenuPage'; //Menu
import Auth from './components/Auth/Auth'; //Login
import Register from './pages/Register/Register'; //Registo
import Profile from './pages/Profile/Profile'; //Perfil do utilizador

//Componentes panel do Gestão
import AdminLayout from './pages/AdminDashboard/AdminLayout';
import GestaoIngredientes from './components/Gestao/GestaoIngredientes/GestaoIngredientes';
import GestaoPratos from './components/Gestao/GestaoPratos/GestaoPratos';
import GestaoMenus from './components/Gestao/GestaoMenu/GestaoMenus';
import GestaoCompras from './components/Gestao/GestaoCompras/GestaoCompras';
import GestaoUtilizadores from './components/Gestao/GestaoUtilizadores/GestaoUtilizadores';


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Logica de autenticação
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
    <CartProvider>
      <Router>
        <Navbar user={currentUser} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route 
            path="/login" 
            element={<Auth onLoginSuccess={(userData) => setCurrentUser(userData)} />} 
          />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminLayout />}>
            Rutas panel do Admin
            <Route index element={<GestaoPratos />} />
            <Route path="pratos" element={<GestaoPratos />} />
            <Route path="menus" element={<GestaoMenus />} />
            <Route path="compras" element={<GestaoCompras />} />
            <Route path="ingredientes" element={<GestaoIngredientes />} />
            <Route path="/admin/utilizadores" element={<GestaoUtilizadores />} />
          
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;