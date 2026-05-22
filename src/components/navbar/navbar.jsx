import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- 1. Importamos useNavigate
import './navbar.css';

function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // <-- 2. Inicializamos el hook de navegación

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
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h2>Early Cafetaria</h2>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link></li>
        <li><Link to="/menu" style={{ color: 'white', textDecoration: 'none' }}>Menu</Link></li>
        <li><Link to="#features" style={{ color: 'white', textDecoration: 'none' }}>Sobre Nós</Link></li>
        <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contato</Link></li>
        <li><Link to="/faq" style={{ color: 'white', textDecoration: 'none' }}>FAQ</Link></li>
      </ul>

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
  );
}

export default Navbar;