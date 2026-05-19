import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos tus componentes y páginas
import Navbar from './components/navbar/navbar'; // Ajusta esta ruta si es diferente
import Home from './pages/Home/Home'; // Ajusta esta ruta si es diferente
import MenuPage from './pages/MenuPage/MenuPage'; // Ajusta esta ruta si es diferente
import Auth from './components/Auth/Auth'; 
//import Profile from './components/Profile/Profile'; // Asumiendo que tu compañero creó esto

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // La lógica de tu compañero para mantener la sesión se queda intacta
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username) {
      setCurrentUser({ username, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      {/* El Navbar ya no necesita recibir funciones para cambiar la "vista" */}
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        
        {/* Transformamos las vistas de tu compañero en Rutas */}
        <Route 
          path="/login" 
          element={<Auth onLoginSuccess={(userData) => setCurrentUser(userData)} />} 
        />
        {/* <Route path="/profile" element={<Profile />} /> */}
        
        {/* Ruta futura para la gestión del administrador */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;