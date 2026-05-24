import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useCart } from '../../context/CartContext'; 
import CartSidebar from '../Cart/CartSidebar';
import './navbar.css';

function Navbar({ user, onLogout }) {
  // Estados para los menús
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 
  const location = useLocation(); 
  
  const { totalItems, clearCart } = useCart(); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  
  // 1. Lógica para el botón "Menu"
  const handleMenuClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsMobileMenuOpen(false); // Cierra el menú móvil al hacer clic
    
    if (!token) {
      navigate('/login');
    } else {
      navigate('/menu');
    }
  }; 

  // Lógica para limpar carrinho ao fim da sessao
  const handleLogout = () => {
    localStorage.clear();
    clearCart();
    setIsCartOpen(false);
    setIsOpen(false);
    window.location.href = '/';
  };

  // 2. Lógica inteligente para hacer Scroll
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Cierra el menú móvil al hacer clic

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Cierra el desplegable del perfil si haces clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsOpen(false); // Si abre el menú móvil, cierra el perfil
  };

  return (
    <>
      <nav className="navbar">
        {/* BOTÓN HAMBURGUESA (Móvil) */}
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Abrir menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className="logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <h2>Early Cafetaria</h2>
          </Link>
        </div>

        {/* ENLACES CENTRALES */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link></li>
          <li><a href="#menu" onClick={handleMenuClick}>Menu</a></li>
          <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Sobre Nós</a></li>
          <li><a href="#footer" onClick={(e) => scrollToSection(e, 'footer')}>Contato</a></li>
        </ul>

        {/* CONTROLES DERECHOS (Carrito + Perfil) */}
        <div className="navbar-actions">
          
          <button className="cart-icon-btn" onClick={() => setIsCartOpen(true)}>
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <div className="user-profile-container" ref={dropdownRef}>
            <div className="user-profile" onClick={() => { setIsOpen(!isOpen); setIsMobileMenuOpen(false); }}>
              <span>👤 {user ? user.username : 'Perfil'}</span>
            </div>

            {/* TARJETA DESPLEGABLE DEL PERFIL */}
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
                    /* OPCIONES PARA USUARIO AUTENTICADO */
                    <>
                      {(user.role === 'ADMIN' || user.role === 'EMPLOYEE') && (
                        <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/admin'); }}>
                          <span className="icon">🛡️</span> Gestão do Sistema
                        </button>
                      )}
                      <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/profile'); }}>
                        <span className="icon">⚙️</span> Editar Perfil
                      </button>
                      <button className="dropdown-btn" onClick={() => { setIsOpen(false); onLogout(); handleLogout(); }}>
                        <span className="icon">🚪</span> Terminar Sessão
                      </button>
                    </>
                  ) : (
                    /* OPCIONES PARA INVITADO (NO REGISTRADO) */
                    <>
                      <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                        <span className="icon">➔</span> Iniciar Sessão
                      </button>
                      
                      {/* NUEVO BOTÓN DE REGISTRO INTEGRADO */}
                      <button className="dropdown-btn highlight-btn" onClick={() => { setIsOpen(false); navigate('/register'); }}>
                        <span className="icon">📝</span> Criar Conta Nova
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}

export default Navbar;