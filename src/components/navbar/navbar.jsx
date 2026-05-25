import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useCart } from '../../context/CartContext'; 
import CartSidebar from '../Cart/CartSidebar';
import './navbar.css';

function Navbar({ user, onLogout }) {
  // Estados para os menus
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 
  const location = useLocation(); 
  
  const { totalItems, clearCart } = useCart(); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  
  // 1. Lógica para o botão "Menu"
  const handleMenuClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsMobileMenuOpen(false); // Fecha o menu móvel ao clicar
    
    if (!token) {
      navigate('/login');
    } else {
      navigate('/menu');
    }
  }; 

  // Lógica para limpar o carrinho ao final da sessão
  const handleLogout = () => {
    localStorage.clear();
    clearCart();
    setIsCartOpen(false);
    setIsOpen(false);
    window.location.href = '/';
  };

  // 2. Lógica inteligente para fazer scroll
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Fecha o menu móvel ao clicar

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

  // Fecha o dropdown de perfil se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para alternar o menu móvel
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsOpen(false); // Se abrir o menu móvel, fecha o perfil
  };

  return (
    <>
      <nav className="navbar">
        {/* BOTÃO HAMBÚRGUER (Móvel) */}
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

        {/* LINKS CENTRAIS */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link></li>
          <li><a href="#menu" onClick={handleMenuClick}>Menu</a></li>
          <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Sobre Nós</a></li>
          <li><a href="#footer" onClick={(e) => scrollToSection(e, 'footer')}>Contato</a></li>
        </ul>

        {/* CONTROLES À DIREITA (Carrinho + Perfil) */}
        <div className="navbar-actions">
          
          <button className="cart-icon-btn" onClick={() => setIsCartOpen(true)}>
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <div className="user-profile-container" ref={dropdownRef}>
            <div className="user-profile" onClick={() => { setIsOpen(!isOpen); setIsMobileMenuOpen(false); }}>
              <span>👤 {user ? user.username : 'Perfil'}</span>
            </div>

            {/* CARTÃO DROPDOWN DO PERFIL */}
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
                    /* OPÇÕES PARA USUÁRIO AUTENTICADO */
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
                    /* OPÇÕES PARA CONVIDADO (NÃO REGISTRADO) */
                    <>
                      <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                        <span className="icon">➔</span> Iniciar Sessão
                      </button>
                      
                      {/* NOVO BOTÃO DE REGISTRO INTEGRADO */}
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