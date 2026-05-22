import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Navbar from './components/navbar/navbar'; // Barra de navegação (Header)
import Home from './pages/Home/Home'; //Inicio
import MenuPage from './pages/MenuPage/MenuPage'; //Menu
import Auth from './components/Auth/Auth'; //Login

//Panel do Gestão
import AdminLayout from './pages/AdminDashboard/AdminLayout';
import GestaoIngredientes from './components/Gestao/GestaoIngredientes/GestaoIngredientes';
import GestaoPratos from './components/Gestao/GestaoPratos/GestaoPratos';
//import GestaoMenus from './components/Gestao/GestaoMenu/GestaoMenus';
//import GestaoCompras from './components/Gestao/GestaoCompras/GestaoCompras';
//import GestaoUtilizadores from './components/Gestao/GestaoUtilizadores/GestaoUtilizadores'; 

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
    <BrowserRouter>
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route 
          path="/login" 
          element={<Auth onLoginSuccess={(userData) => setCurrentUser(userData)} />} 
        />
        <Route path="/admin" element={<AdminLayout />}>
          {/*Rutas panel do Admin
          <Route index element={<GestaoPratos />} />
          <Route path="pratos" element={<GestaoPratos />} />
          <Route path="menu" element={<GestaoMenus />} />
          <Route path="compras" element={<GestaoCompras />} />
          <Route path="ingredientes" element={<GestaoIngredientes />} />
          <Route path="utilizadores" element={<GestaoUtilizadores />} /> */}
          <Route path="pratos" element={<GestaoPratos />} />
          <Route path="ingredientes" element={<GestaoIngredientes />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;