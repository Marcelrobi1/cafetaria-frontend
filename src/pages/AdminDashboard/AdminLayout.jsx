import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Estado para controlar o menu lateral em dispositivos móveis
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Proteção global da rota do layout
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

  // Funções para gerir o menu em dispositivos móveis
  const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="admin-layout-container">
      
      {/* MENU HAMBURGUER (Visível apenas em telemóveis) */}
      <div className="admin-mobile-header">
        <div className="mobile-brand">
          <h3>Portal Early</h3>
        </div>
        <button className="admin-hamburger" onClick={toggleSidebar}>
          {isMobileSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Para fechar o menu, toque fora do mesmo. */}
      {isMobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* BARRA LATERAL (SIDEBAR) */}
      {/* Classe dinâmica 'aberta' se o estado for verdadeiro */}
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

      {/* ÁREA DE CONTEÚDO DINÂMICO */}
      <main className="admin-main-content">
        <div className="content-wrapper">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;