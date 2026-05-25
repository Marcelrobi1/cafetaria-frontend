import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // NUEVO: Estado para controlar el menú lateral en dispositivos móviles
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Protección de la ruta a nivel global del Layout
  useEffect(() => {
    const role = localStorage.getItem('role') || localStorage.getItem('userType');
    const token = localStorage.getItem('token');

    if (!token || (role !== 'ADMIN' && role !== 'EMPLOYEE')) {
      navigate('/login'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    clearCart();
    window.location.href = '/'; 
  };

  // Funciones para manejar el menú en móviles
  const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="admin-layout-container">
      
      {/* NUEVO: CABECERA MÓVIL (Solo visible en teléfonos) */}
      <div className="admin-mobile-header">
        <div className="mobile-brand">
          <h3>Portal Early</h3>
        </div>
        <button className="admin-hamburger" onClick={toggleSidebar}>
          {isMobileSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* NUEVO: OVERLAY OSCURO (Para cerrar el menú tocando fuera) */}
      {isMobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* BARRA LATERAL (SIDEBAR) */}
      {/* Añadimos una clase dinámica 'open' si el estado es true */}
      <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h3>Gestão Portal</h3>
          <p>Early Cedofeita</p>
        </div>

        <nav className="sidebar-nav">
          {/* Añadimos onClick={closeSidebar} para que el menú se cierre al elegir una opción */}
          <NavLink to="/admin/pratos" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🍽️</span> Gestão de Pratos
          </NavLink>
          
          <NavLink to="/admin/menus" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">📅</span> Menu Diário
          </NavLink>
          
          <NavLink to="/admin/compras" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🛍️</span> Compras e Pedidos
          </NavLink>
          
          <NavLink to="/admin/ingredientes" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🧅</span> Ingredientes
          </NavLink>
          
          <NavLink to="/admin/utilizadores" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">👥</span> Utilizadores
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item action-btn">
            <span className="icon">❓</span> Suporte
          </button>
          <button className="nav-item action-btn" onClick={handleLogout}>
            <span className="icon">🚪</span> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="admin-main-content">
        <div className="content-wrapper">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;