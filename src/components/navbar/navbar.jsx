import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <-- 1. Importamos useNavigate
import  { useCart } from '../../context/CartContext'; // <-- Importamos el hook del carrito
import CartSidebar from '../Cart/CartSidebar'
import './navbar.css';

function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // <-- 2. Inicializamos el hook de navegación
  const location = useLocation(); // <-- 3. Inicializamos el hook de ubicación
  
  const { totalItems, clearCart } = useCart(); // <-- Obtenemos el número total de artículos en el carrito
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar la visibilidad del carrito
  
  // 1. Lógica para el botón "Menu"
  const handleMenuClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Si no está autenticado, lo enviamos al login
      navigate('/login');
    } else {
      // Si está autenticado, lo enviamos al catálogo
      navigate('/menu');
    }
  }; 

  // Logica para limpar carrinho ao fim da sessao
  const handleLogout = () => {
    // 1. Destruimos la sesión del cliente en el navegador
    localStorage.clear();
    
    // 2. ¡VITAL! Destruimos el carrito del cliente en la memoria de React
    clearCart();
    
    // 3. Cerramos la ventana del carrito y lo expulsamos al inicio
    setIsCartOpen(false);
    window.location.href = '/';
  };

  // 2. Lógica inteligente para hacer Scroll
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();

    // Si NO estamos en la página de inicio, primero navegamos allá
    if (location.pathname !== '/') {
      navigate('/');
      // Le damos un pequeño respiro a React para que renderice la página antes de buscar el ID
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si ya estamos en el inicio, hacemos scroll directamente
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h2>Early Cafetaria</h2>
          </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link></li>
          <li><a to="/menu" onClick={handleMenuClick} style={{ color: 'white', textDecoration: 'none' }}>Menu</a></li>
          <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')} style={{ color: 'white', textDecoration: 'none' }}>Sobre Nós</a></li>
          <li><a href="#footer" onClick={(e) => scrollToSection(e, 'footer')} style={{ color: 'white', textDecoration: 'none' }}>Contato</a></li>
          <li><Link to="/faq" style={{ color: 'white', textDecoration: 'none' }}>FAQ</Link></li>
        </ul>

        <div className="navbar-actions">
            {/* Botón del Carrito con Medalla (Badge) de cantidad */}
            <button className="cart-icon-btn" onClick={() => setIsCartOpen(true)}>
              🛒
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>

        <div className="user-profile-container" ref={dropdownRef}>
          <div className="user-profile" onClick={() => setIsOpen(!isOpen)}>
            <span>👤 {user ? user.username : 'Perfil'}</span>
          </div>

          {isOpen && (
            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-header">
                <div className="avatar-placeholder">👤</div>
                {user ? (
                  <>
                    <h3>Olá, {user.username}</h3>
                    <p>{user.role === 'ADMIN' ? 'Administrador' : user.role === 'EMPLOYEE' ? 'Funcionário' : 'Cliente'}</p>
                  </>
                ) : (
                  <>
                    <h3>Acesso à Conta</h3>
                    <p>FAÇA LOGIN PARA CONTINUAR</p>
                  </>
                )}
              </div>

              <div className="dropdown-actions">
                {user ? (
                  <>
                    {user.role === 'ADMIN' && (
                      <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/admin'); }}>
                        <span className="icon">🛡️</span> Gestão do Sistema
                      </button>
                    )}
                    <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/profile'); }}>
                      <span className="icon">⚙️</span> Editar Perfil
                    </button>
                    <button className="dropdown-btn" onClick={() => { 
                        setIsOpen(false); 
                        onLogout(); 
                        navigate('/'); // Redirige al inicio tras cerrar sesión
                    }}>
                      <span className="icon">🚪</span> Terminar Sessão
                    </button>
                  </>
                ) : (
                  <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                    <span className="icon">➔</span> Iniciar Sessão
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Renderizamos el Sidebar fuera del Nav */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}

export default Navbar;