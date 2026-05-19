import { useState, useRef, useEffect } from 'react';
import './navbar.css';

function Navbar({ user, onLoginClick, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Early Cafetaria</h2>
      </div>
      <ul className="nav-links">
        <li>Inicio</li>
        <li>Menu</li>
        <li>Sobre Nós</li>
        <li>Contato</li>
        <li>FAQ</li>
      </ul>
      
      <div className="user-profile-container" ref={dropdownRef}>
        <div className="user-profile" onClick={() => setIsOpen(!isOpen)}>
          <span>👤 {user ? user.username : 'Perfil'}</span>
        </div>

        {isOpen && (
          <div className="profile-dropdown">
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
                    <button className="dropdown-btn" onClick={() => { setIsOpen(false); /* Lógica para ir para a Dashboard */ }}>
                      <span className="icon">🛡️</span> Gestão do Sistema
                    </button>
                  )}
                  <button className="dropdown-btn" onClick={() => { setIsOpen(false); /* Ação de editar perfil */ }}>
                    <span className="icon">⚙️</span> Editar Perfil
                  </button>
                  <button className="dropdown-btn" onClick={() => { setIsOpen(false); onLogout(); }}>
                    <span className="icon">🚪</span> Terminar Sessão
                  </button>
                </>
              ) : (
                <button className="dropdown-btn" onClick={() => { setIsOpen(false); onLoginClick(); }}>
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