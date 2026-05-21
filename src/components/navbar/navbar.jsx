﻿import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  
  // 1. Estado para controlar se o pop-up está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 2. Lógica para fechar o pop-up se o utilizador clicar noutro sítio do ecrã
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
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h2>Early Cafetaria</h2>
      </div>
      <ul className="nav-links">
        <li onClick={() => navigate('/')}>Inicio</li>
        <li>Menu</li>
        <li>Sobre Nós</li>
        <li>Contato</li>
        <li>FAQ</li>
      </ul>
      
      {/* 3. Container do Pop-up */}
      <div className="user-profile-container" ref={dropdownRef}>
        <div className="user-profile" onClick={() => setIsOpen(!isOpen)}>
          <span>👤 {user ? user.username : 'Perfil'}</span>
        </div>

        {/* 4. O Pop-up propriamente dito (só aparece se isOpen for true) */}
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
                    <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/dashboard'); }}>
                      <span className="icon">🛡️</span> Gestão do Sistema
                    </button>
                  )}
                  {/* Botão que leva à nova página de Perfil */}
                  <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/profile'); }}>
                    <span className="icon">⚙️</span> Editar Perfil
                  </button>
                  <button className="dropdown-btn" onClick={() => { setIsOpen(false); onLogout(); }}>
                    <span className="icon">🚪</span> Terminar Sessão
                  </button>
                </>
              ) : (
                <button className="dropdown-btn" onClick={() => { setIsOpen(false); navigate('/auth'); }}>
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