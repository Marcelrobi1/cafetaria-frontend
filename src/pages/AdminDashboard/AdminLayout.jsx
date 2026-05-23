import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();

  // Protección de la ruta a nivel global del Layout
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || (role !== 'ADMIN' && role !== 'EMPLOYEE')) {
      navigate('/login'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    clearCart();
    
    // HARD REDIRECT: Destruye el árbol de React y vuelve a montar la aplicación
    window.location.href = '/'; 
  };

  return (
    <div className="admin-layout-container">
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h3>Gestão Portal</h3>
          <p>Early Cedofeita</p>
        </div>

        {/* Usamos NavLink en lugar de Link. 
          NavLink añade automáticamente la clase "active" si estamos en esa URL, 
          lo que nos permite pintar el botón seleccionado.
        */}
        <nav className="sidebar-nav">
          <NavLink to="/admin/pratos" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🍽️</span> Gestão de Prato
          </NavLink>
          
          <NavLink to="/admin/menus" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">📅</span> Menu Diário
          </NavLink>
          
          <NavLink to="/admin/compras" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🛍️</span> Compras e Pedidos
          </NavLink>
          
          <NavLink to="/admin/ingredientes" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🧅</span> Ingredientes
          </NavLink>
          
          <NavLink to="/admin/utilizadores" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">👥</span> Utilizadores
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item action-btn">
            <span className="icon">❓</span> Support
          </button>
          <button className="nav-item action-btn" onClick={handleLogout}>
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="admin-main-content">
      
        
        {/* Aquí se inyectarán GestaoPratos, GestaoMenus, etc. */}
        <div className="content-wrapper">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;